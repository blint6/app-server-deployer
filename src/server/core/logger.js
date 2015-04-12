let path = require('path');
let mkdirp = require('mkdirp');

let logger;

function logFactory(level) {
    let consoleLog = console[level];

    return function log() {
        if (arguments.length > 0) {
            let args = Array.prototype.slice.call(arguments);
            let formatString = args.shift();

            args.forEach(arg => formatString = formatString.replace(/%[sd]/, '' + arg));
            consoleLog(formatString);
        }
    };
}

if (process.env.NODE_ENV === 'spec') {
    logger = {
        debug: logFactory('log'),
        info: logFactory('info'),
        warn: logFactory('warn'),
        error: logFactory('error')
    };
} else {
    let winston = require('winston');
    let Logger = winston.Logger;
    let logDir = 'log';

    mkdirp.sync(logDir);

    logger = new Logger({
        transports: [
            new winston.transports.DailyRotateFile({
                name: 'minode',
                filename: path.resolve(logDir, 'minode'),
                datePattern: '.yyyy-MM-dd.log',
                level: 'debug',
            }),
            new winston.transports.Console({
                name: 'console',
                level: 'debug',
                prettyPrint: true,
            })
        ],
    });
}

module.exports = logger;
