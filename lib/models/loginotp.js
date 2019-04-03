var mongoose = require('mongoose'),Schema = mongoose.Schema;
var LoginOTPSchema = new Schema({
    otp: {
        type: String,
        required: true
    },
    ttl:{ type: Date, default: new Date() },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    mobile:{
        type: Number,
        required: true
    },
});
module.exports = mongoose.model('LoginOTP', LoginOTPSchema);