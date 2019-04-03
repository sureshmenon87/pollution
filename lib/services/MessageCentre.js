const request = require('request-promise');
let logger = require("../logger");

class MessageCentre {

    sendOTP(number, otp) {
        let options = {
            method: 'POST',
            uri: 'https://api.textlocal.in/send/',
            form: {
                apikey: 'rzujrITdJeI-kfuEtIGbnSe6v20pqs7UnRh5cgMIjE',
                numbers: number,
                message: otp + ' is the OTP for your login. Thank you',
                username:'sureshmenon87@gmail.com',
                password:'sU5aP7oC'
            },
            json: true
        };
        console.log('options ', options);
        return request(options).then((body) => {            
            if(body.errors) {
                throw "otpDeliverFailed";
            }
            logger.info("OTP delivered successfully", body);
            return true;
        }).catch((err) => {
            logger.error("Error occured in MessageCentre sendOTP() ", err);
            throw "otpDeliverFailed";
        })
    }

}
module.exports = new MessageCentre();

