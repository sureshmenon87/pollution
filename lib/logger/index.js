let winston =require('winston');
class Logger {
  constructor() {
    this.transports = [];
    this.transports.push(new (winston.transports.Console)({
      level: 'debug',
      colorize: true,
      timestamp: function () {
          return (new Date()).toLocaleTimeString();
      },
      prettyPrint: true
    }));
  }
}

module.exports = new (winston.Logger)({
  transports: new Logger().transports
});