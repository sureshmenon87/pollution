
let LoginOTPModel = require('../models/loginotp');
let UsersOtpModel = require('../models/usersotp');
let PollutionReportsModel = require('../models/pollutionReports');
var otpGenerator = require('otp-generator')
var Promise = require("bluebird");
const jwt = require('jsonwebtoken');
var base64 = require('file-base64');
var nodemailer = require('nodemailer');
let moments = require("moment");
let logger = require("../logger");
const uuidv4 = require('uuid/v4');
let UserProfile = require('../models/userprofile');
let messageCentre = require('./MessageCentre.js');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pollutionvolunteer@gmail.com',
        pass: 'r00t@123'
    }
});
var fs = require('fs');

class UserProvider {


    reportPollution(payload, photo) {
        payload.photo = new Buffer(fs.readFileSync(photo)).toString("base64")
        var pollutionReportsModel = new PollutionReportsModel(payload);
        return pollutionReportsModel.save().then(function () {
            var mailOptions = {
                from: 'pollutionvolunteer@gmail.com',
                to: 'sureshmenon87@gmail.com',
                subject: 'Thank you for your interest',
                text: 'Report is successfully submitted and thank you for the interest shown to control pollution'
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        });
    }



    login(payload) {
        return this.findUserByMobileNo(payload.mobileNo).then(function (doc) {
            if (doc) {
                let otp = otpGenerator.generate(4, { upperCase: false, specialChars: false });
                let loginOTPModel = new LoginOTPModel({ otp: otp, ttl: new Date(), userId: doc._id, mobile: doc.mobileNo });
                return loginOTPModel.save().then(function () {
                    return otp;
                })
            } else {
                throw "userNotFound";
            }
        });
    }

    async authenticate(payload) {
        let pastDate = new Date;
        pastDate.setMinutes(pastDate.getMinutes() - 15);
        let otpDoc = await UsersOtpModel.findOne({ otp: payload.otp, updatedDate: { $gte: pastDate } })
        let profile = await UserProfile.findOne({ mobile: payload.mobileNo });
        let tokenPayload = {};
        if (profile) {
            tokenPayload._id = profile._id;
        } else {
            let res = await this.createProfile({ mobile: payload.mobileNo });
            tokenPayload._id = res._id;
        }

        if (otpDoc) {
            const token = jwt.sign(tokenPayload, 'vmenosu');
            return Promise.resolve({ token: token });
        } else {
            throw "invalidOtp";
        }
    }

    async createProfile(payload) {
        payload.uid = uuidv4();
        let userProfile = new UserProfile(payload)
        let doc = await userProfile.save();
        return Promise.resolve(doc);
    }

    async updateProfile(id, payload) {
        let doc = UserProfile.findByIdAndUpdate({ _id: id }, {
            $set:
            {
                name: payload.name,
                age: payload.age,
                gender: payload.gender,
                email: payload.email,
                updatedDate: new Date()
            }
        }, { new: true })
        return Promise.resolve(doc);
    }



    async verifyMobile(payload) {

        try {
            let res, RESPONSE = "EXISTING_MOBILE"
            let pastDate = new Date;
            pastDate.setMinutes(pastDate.getMinutes() - 15);
            let user = await UserProfile.findOne({ mobile: payload.mobileNo });
            if (!user)
                RESPONSE = "NEW_MOBILE"

            let docs = await UsersOtpModel.find({ mobile: payload.mobileNo, updatedDate: { $gte: pastDate } }).sort({ updatedDate: -1 });
            if (docs && docs.length > 0) {
                let lastOtp = docs[docs.length - 1].otp;
                let res = await UsersOtpModel.findOneAndUpdate(
                    { _id: docs[docs.length - 1]._id, mobile: payload.mobileNo, otp: docs[docs.length - 1].otp },
                    { $set: { mobile: payload.mobileNo, updatedDate: new Date() }, $inc: { otpAttempts: 1 } })
                let isOTPDelivered = await messageCentre.sendOTP(payload.mobileNo, lastOtp);
                logger.debug('isOTPDelivered ', isOTPDelivered);
                if (isOTPDelivered) {
                    return Promise.resolve(RESPONSE)
                } else {
                    throw "OtpDeliveryFailed"
                }
            } else {
                let otp = await this.generateOtp(payload.mobileNo, docs);
                console.log('otp ', otp);
                let isOTPDelivered = await messageCentre.sendOTP(payload.mobileNo, otp);
                logger.debug('isOTPDelivered ', isOTPDelivered);
                if (isOTPDelivered) {
                    let usersOtpModel = new UsersOtpModel({ mobile: payload.mobileNo, countryCode: payload.countryCode, createdDate: new Date(), otp: otp, otpAttempts: 1 })
                    res = await usersOtpModel.save();
                } else {
                    throw "OtpDeliveryFailed"
                }
            }
            return Promise.resolve(RESPONSE);
        } catch (err) {
            throw err
        }
    }

    generateOtp(mobileNo, docs) {
        return Promise.resolve(parseInt(Math.random() * 90000));

        /*
        return new Promise(resolve => {
            setTimeout(() => {
                //if (docs.length > 0) {
                  //  resolve(docs[docs.length - 1].otp)
                //} else {
                    resolve(parseInt(Math.random()*90000));
                //}
            }, 1000);
        });*/
    }

}



let userProvider = new UserProvider();
module.exports = userProvider;
