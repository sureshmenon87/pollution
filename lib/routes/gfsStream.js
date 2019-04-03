module.exports = function () {
    const Grid = require('gridfs-stream');
    let mongoose = require("mongoose");
    Grid.mongo = mongoose.mongo;
    let gfs = Grid(mongoose.connection.db);
    return gfs
}