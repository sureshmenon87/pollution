var mongoose = require('mongoose'), Schema = mongoose.Schema;
var ImagesSchema = new Schema({
    imageId: { type: Schema.Types.ObjectId },
    status : { type: String, required: true},
    createdDate: { type: Date, default: new Date() },
    updatedDate: { type: Date, default: new Date() }
});
module.exports = mongoose.model('Images', ImagesSchema);