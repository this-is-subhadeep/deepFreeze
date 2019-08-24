const fs = require('fs');
const winston = require('winston');
const { serverConfig } = require('../config').appConfig;

let debugLevel = serverConfig.environment.prod ? 'warn' : 'debug';

const options = {
    file : {
        level : debugLevel,
        filename : serverConfig.logLocation+'/server.log',
        handleExceptions : true,
        json : true,
        maxsize : 5242880,
        maxFiles : 10,
        colorize : false
    },
    console : {
        level : debugLevel,
        handleExceptions : true,
        json : false,
        colorize : true
    }
};

const winLogger = winston.createLogger({
    transports : [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    format : winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf( info => {
            return `[${info.timestamp}] - <${info.level}> : ${info.message}`;
        })
    ),
    exitOnError : false
}); 

winLogger.stream = {
    write : (message, encoding) => {
        winLogger.info(message);
    }
};

module.exports = winLogger;