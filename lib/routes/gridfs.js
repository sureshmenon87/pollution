module.exports = function () {
    const GridFsStorage = require('multer-gridfs-storage');

    const storage = new GridFsStorage({
        url: 'mongodb://127.0.0.1:27017/pollution',
        file: (req, file) => {
            return {
                filename: 'file_' + Date.now()
            };
        }
    });
    storage
        .ready()
        .then((db) => {
            console.log('Db is the database instance');
        })
        .catch((err) => {
            console.log('err', err)
        });
    return storage
}