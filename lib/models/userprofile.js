var mongoose = require('mongoose'),Schema = mongoose.Schema;
var UserProfileSchema = new Schema({
    name: {
        type: String,

    },
    uid:{type: String, required: true, unique: true},
    gender: {
        type: String
    },
    age: {
        type: Number
    },
    email: {
        type: String
    },
    mobile: {
        type: Number,
        unique: true,
        required: true
    },
    createdDate: { type: Date, default: new Date() },
    updatedDate: { type: Date, default: new Date() }
});
module.exports = mongoose.model('UserProfile', UserProfileSchema);;