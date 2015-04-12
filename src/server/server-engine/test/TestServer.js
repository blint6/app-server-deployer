let path = require('path');
let spawn = require('child_process').spawn;
let winston = require('winston');
let log = require('../../core/logger');
let forEachLine = require('../../fs/forEachLine');
let AppServer = require('../AppServer');

class TestServer extends AppServer {

    constructor(appServerDef, options) {
        super(appServerDef);
        options = options || {};
        this.sendInterval = options.sendInterval || -1;
    }

    prepareIo() {
        log.debug('TestServer#prepareIo - Sit back, we are not writing any file');
    }

    getLogTransports() {
        return [
            new winston.transports.Memory({
                name: 'memory',
                level: 'debug',
                prettyPrint: true,
            }),
            new winston.transports.Console({
                name: 'console',
                level: 'debug',
                prettyPrint: true,
            })
        ];
    }

    spawnServer() {
        let args = [require.resolve('./TestServerProcess'), this.getName(), this.sendInterval];
        log.info('Executing test server with command: node %s', args.join(' '));
        return spawn('node', args);
    }

    stop() {
        if (this.process) {
            log.info('Terminating server by sending stop message');
            this.sendMessage('stop');
            return this.processEnded;
        }
    }

    /* For test purpose only, Dispatcher should be used otherwise */
    registerOnNewLine(cb) {
        let listener = forEachLine(cb);
        this.process.stdout.on('data', listener);
        return listener;
    }

    unregisterOnNewLine(listener) {
        this.process.stdout.removeListener('data', listener);
    }

    registerOnNewError(cb) {
        let listener = forEachLine(cb);
        this.process.stderr.on('data', listener);
        return listener;
    }

    unregisterOnNewError(listener) {
        this.process.stderr.removeListener('data', listener);
    }
}

TestServer.install = function install(appServerDef, options) {
    return new TestServer(appServerDef, options);
};

TestServer.load = function load(name, options) {
    return new TestServer(name, options);
};

module.exports = TestServer;
