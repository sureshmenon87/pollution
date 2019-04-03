
let userProvider = require('../services/userProvider.js');
let logger = require('../logger');


class UserController {

/*
    post(req, res) {
        userProvider.post(req.body).then(function (otp) {
            res.set("otp",otp);
            res.status(200).send({ message: "OTP sent to your mobile number"});
        }).catch(function (err) {
            logger.error("Error occured in user creation ", err);
            return res.boom.badImplementation(err);
        });
    }
    reportPollution(req, res) {
        req.body.reportedBy=req.userContext._id;
        userProvider.reportPollution(req.body, req.files.vehiclePhoto.file).then(function (otp) {
            res.status(200).send({ message: "We have recorded your report. Thanks"});
        }).catch(function (err) {
            logger.error("Error occured in reportpollution ", err);
            return res.boom.badImplementation(err);
        });
    }

    validateRegistrationOTP(req, res) {
        userProvider.submitOTP(req.body).then(function (data) {
            res.status(200).send({ message: "You account is accpeted" });
        }).catch(function (err) {
            logger.error("Error occured in otp submit ", err);
            if (err === "otpExpired")
                res.boom.notFound("OTP not found or expired");
            return res.boom.badImplementation(err);
        });
    }

    login(req, res) {
        userProvider.login(req.body).then(function (otp) {
            res.set("otp",otp);
            res.status(200).send({ message: "OTP sent to your mobile number"});
        }).catch(function (err) {
            logger.error("Error occured during login ", err);
            if (err === "userNotFound")
                res.boom.notFound("Not a registered mobile no");
            return res.boom.badImplementation(err);
        });
    }
    getUserDetails(req, res) {
        userProvider.findUserById(req.userContext._id).then(function (data) {
            if (!data) throw "userNotFound";
            res.status(200).send(data);
        }).catch(function (err) {
            logger.error("Error occured getUserDetails ", err);
            if (err === "userNotFound")
                res.boom.notFound("User not found!");
            return res.boom.badImplementation(err);
        });
    }

    updateUserDetails(req, res) {
        if(req.userContext.mobile!==req.body.mobileNo)
            req.body.token=null;
        userProvider.updateUserDetails(req.userContext._id, req.body).then(function (data) {
            res.status(200).send({message:"User information has been updated"});
        }).catch(function (err) {
            logger.error("Error occured getUserDetails ", err);
            return res.boom.badImplementation(err);
        });
    }*/

    authenticate(req, res) {
        userProvider.authenticate(req.body).then(function (data) {
            res.status(200).send(data);
        }).catch(function (err) {
            logger.error("Error occured in userController.authenticate", err);
            if (err === "invalidOtp")
            return res.boom.unauthorized("Invalid OTP");
            return res.boom.badImplementation(err);
        });
    }

    createProfile(req, res){
        userProvider.createProfile(req.body).then(function (data) {
            res.status(200).send(data);
        }).catch(function (err) {
            logger.error("Error occured in userController.createProfile", err);
            if (err.code === 11000 && err.message.indexOf("email") !== -1)
                return res.boom.conflict("Email id is already taken");
            else if (err.code === 11000 && err.message.indexOf("mobile") !== -1)
                return res.boom.conflict("Mobile no is already registered");
            return res.boom.badImplementation(err);
        });
    }
    updateProfile(req, res){
        console.log(req.userContext._id)
      
        userProvider.updateProfile(req.userContext._id, req.body).then(function (data) {
            res.status(200).send(data);
        }).catch(function (err) {
            logger.error("Error occured in userController.updateProfile", err);
            return res.boom.badImplementation(err);
        });
    }


/*

    delete(req, res) {
        userProvider.delete(req.params.id, req.userContext._id).then(function (data) {
            res.status(200).send(data);
        }).catch(function (err) {
            logger.error("Error occured in userController.delete", err);
            return res.boom.badImplementation(err);
        });
    }*/

    verify(req, res) {
        userProvider.verifyMobile(req.body).then(function (data) {
            if (data === "EXISTING_MOBILE")
                res.status(200).send();
            else if (data === "NEW_MOBILE")
                res.status(201).send();
        }).catch(function (err) {
            logger.error("Error occured in userController.verify ", err);
            return res.boom.badImplementation(err);
        });
    }

}

let userController = new UserController();
module.exports = userController;