let path = require('path');
let spawn = require('child_process').spawn;
let winston = require('winston');
let log = require('../../core/logger');
let forEachLine = require('../../fs/forEachLine');
let AppServer = require('../AppServer');

class TestServer extends AppServer {

    constructor(name, options) {
        options = options || {};
        super({
            name: name,
            engine: 'test',
            port: 0,
            memory: 1024,
            sendInterval: options.sendInterval || -1
        });
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
        let args = [require.resolve('./TestServerProcess'), this.getName(), this.appServerDef.sendInterval];
        log.info('Executing test server with command: node %s', args.join(' '));
        return spawn('node', args);
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
}

TestServer.load = function load(name, options) {
    return new TestServer(name, options);
};

module.exports = TestServer;
