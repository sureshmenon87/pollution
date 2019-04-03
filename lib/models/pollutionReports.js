var mongoose = require('mongoose'),Schema = mongoose.Schema;
var pollutionReportsSchema = new Schema({
    vehicle: {
        type: String,
        uppercase:true,
        required: true
    },
    vehicleNo: {
        type: String,
        uppercase:true     
    },
    emissionColor: {
        type: String,
        uppercase:true,
        required: true   
    },
    geoCoordinates:[{type: Number}],
    photoId:{ type: Schema.Types.ObjectId },
    country: {
        type: String
    },
    state: {
        type: String
        
    }, 
    city: {
        type: String
    },
    status:{type: String, required:true},
    createdAt: { type: Date, default: new Date() },
    reportedBy:{ type: Schema.Types.ObjectId, ref: 'User' },
});
module.exports = mongoose.model('pollutionReports', pollutionReportsSchema);;