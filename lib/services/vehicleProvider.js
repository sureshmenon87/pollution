
let PollutionReportsModel = require('../models/pollutionReports');
let Images = require("../models/images");
let mongoose = require('mongoose');
const DEFAULT_PAGE_SIZE = 10;
class VehicleProvider {
    searchVehicles(query, userId) {
        var selectedFields = {}, queryOptions={};
        var pageSize = DEFAULT_PAGE_SIZE, pageNo = 0, pageSize = 0, skips = 0; 

        if (query && query.fields === "vehicle_no"){
            selectedFields.vehicleNo = 1;
            queryOptions.vehicleNo= new RegExp('^' + query.search);
        }
        else{
            selectedFields.photo = 0;
        }

        if (query.pageSize)
            pageSize = parseInt(query.pageSize);
        if (query.pageNo) {
            pageNo = parseInt(query.pageNo);
            skips = pageSize * (pageNo - 1);
        }

        if(query.my_reports){
            queryOptions.reportedBy=userId;
        }

        return PollutionReportsModel.find(queryOptions, selectedFields).skip(skips).limit(pageSize)
    }

    getVehiclePhoto(id){
        let gfs = require('../routes/gfsStream.js')()       
        return new Promise((resolve, reject)=>{
            gfs.files.find({_id:mongoose.Types.ObjectId(id)}).toArray((err, files)=>{
                if(err) reject(err);
                if(!files) throw "fileNotFound"
                var readstream = gfs.createReadStream({
                    filename: files[0].filename
                });                
                resolve([readstream, files[0].contentType]);
            })
        });      
    }
    
    saveVehiclePhoto(file){
      let images = new Images({imageId: file.id, status: "NOT_USED"});  
      return images.save();
    }

    reportVehiclePollution(payload){
        payload.status="SUBMITTED";
        let pollutionReport = new PollutionReportsModel(payload);
        return pollutionReport.save();
    }


    getPollutionById(id){           
        return PollutionReportsModel.findById({_id:id});
    }
    deletePollutionRecord(){
        return PollutionReportsModel.remove({_id:id});
    }
}
let vehicleProvider = new VehicleProvider();
module.exports = vehicleProvider;
