var mongoose = require('mongoose'), Schema = mongoose.Schema;
var UsersOtpSchema = new Schema({
    otp: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    countryCode: {type: String, required: true},
    otpAttempts:{type: Number, required: true},
    createdDate: { type: Date, default: new Date() },
    updatedDate: { type: Date, default: new Date() }
});
module.exports = mongoose.model('UsersOtp', UsersOtpSchema);