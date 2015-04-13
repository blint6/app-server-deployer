let path = require('path');
let mkdirp = require('mkdirp');

let logger;

function testLogFactory(level) {
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

function getProdLogger() {
    let winston = require('winston');
    let Logger = winston.Logger;
    let logDir = 'log';

    mkdirp.sync(logDir);

    return new Logger({
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

/* istanbul ignore next */
if (process.env.NODE_ENV === 'spec') {
    module.exports = {
        debug: testLogFactory('log'),
        info: testLogFactory('info'),
        warn: testLogFactory('warn'),
        error: testLogFactory('error'),
        getProdLogger: getProdLogger,
    };
} else {
    module.exports = getProdLogger();
}
