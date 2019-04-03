let bcrypt = require('bcrypt');
let moment = require('moment');
class Utils
{
    bcrypt(txt, hash) {
        return bcrypt.compare(txt, hash);
    }

    hashText(text,saltRounds){
        return bcrypt.hash(text, saltRounds || 10)

    }

    

    

    getSubtractedDate(srcDate, days) {
        if (!srcDate) srcDate = new Date();
        var dateResult = moment(srcDate).subtract(days, 'd')
        console.log('dateResult ',dateResult);
        return dateResult;
    }




}
let utils = new Utils();
module.exports = utils;