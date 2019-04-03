
let vehicleProvider = require('../services/vehicleProvider.js');
let logger = require('../logger');

class VehicleController {

    searchVehicles(req, res) {
        vehicleProvider.searchVehicles(req.query, req.userContext._id).then(function (data) {
            res.status(200).send(data);
        }).catch(function (err) {
            return res.boom.badImplementation(err);
        });
    }
    
    getVehiclePhoto(req, res) {
        vehicleProvider.getVehiclePhoto(req.params.id).then(function (result) {          
                res.set('Content-Type', result[1])
                /** return response */
                return result[0].pipe(res);
           
        }).catch(function (err) {
            logger.error("Error occured in VehicleController.getVehiclePhoto ", err);
           if(err==="fileNotFound") return res.boom.notFound("Image not found");
            return res.boom.badImplementation(err);
        });
    }
    vehiclePhoto(req, res){
        vehicleProvider.saveVehiclePhoto(req.file).then(function (data) {
            res.status(200).send({imageId:data.imageId}); 
        }).catch(function (err) {
            logger.error("Error occured in VehicleController.vehiclePhoto ", err);
            return res.boom.badImplementation(err);
        });
    }

    reportVehiclePollution(req, res){
        vehicleProvider.reportVehiclePollution(req.body).then(function (data) {
            res.status(200).send(data); 
        }).catch(function (err) {
            logger.error("Error occured in VehicleController.reportVehiclePollution ", err);
            return res.boom.badImplementation(err);
        });
    }

    getPollutionById(req, res){
        vehicleProvider.getPollutionById(req.params.id).then(function (data) {
            res.status(200).send(data); 
        }).catch(function (err) {
            logger.error("Error occured in VehicleController.getPollutionById ", err);
            return res.boom.badImplementation(err);
        });
    }
    deletePollutionRecord(req, res){
        vehicleProvider.deletePollutionRecord(req.params.id).then(function (data) {
            res.status(200).send(data); 
        }).catch(function (err) {
            logger.error("Error occured in VehicleController.deletePollutionRecord ", err);
            return res.boom.badImplementation(err);
        });
    }
    

}

let vehicleController = new VehicleController();
module.exports = vehicleController;