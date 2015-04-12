let fs = require('fs');
let path = require('path');
let Promise = require('es6-promise').Promise;
let winston = require('winston');
let Logger = winston.Logger;
let log = require('../core/logger');
let tailFile = require('../fs/tailFile');
let forEachLine = require('../fs/forEachLine');
let AppServerModel = require('./AppServerModel');
let ConsoleActions = require('minode/component/console/ConsoleActionsSrv');

let engines = {
    bukkit: './bukkit/BukkitServer',
};


class AppServer {

    constructor(serverDef) {
        this.appServerDef = serverDef;
        this.path = serverDef.name.replace(/[\/\\]/g, '_');
        this.log = new Logger({
            transports: this.getLogTransports()
        });
    }

    run() {
        if (this.process) {
            throw Error('Cannot start server, already running');
        }

        Promise.resolve(this.prepareIo())

            .then(() => {
                log.info('Spawning server process');
                this.process = this.spawnServer();
                this.process.stdout.on('data', forEachLine(this.handleStdout.bind(this)));
                this.process.stderr.on('data', forEachLine(this.handleStderr.bind(this)));

                // Process terminated
                this.processEnded = new Promise(function (resolve) {
                    this.process.on('close', function (code, signal) {
                        delete this.process;
                        let processEnded = {};

                        if (signal) {
                            log.info('Server closed - got signal %s', signal);
                            processEnded.signal = signal;
                        }
                        if (code !== null) {
                            if (code === 0)
                                log.info('Server closed successfully');
                            else
                                log.error('Server exited with code %d', code);

                            processEnded.code = code;
                        }

                        resolve(processEnded);
                    }.bind(this));
                }.bind(this));

                // Log notifier
                ConsoleActions.registerServer(this);
            })

            .then(() => {
                log.info('Server process started');
            }, err => {
                log.error('Failed to start the server', err);
            });
    }

    sendMessage(message) {
        this.process.stdin.write(message + '\n');
    }

    stop() {
        if (this.process) {
            log.info('Terminating server');
            this.process.kill('SIGTERM');
            return this.processEnded;
        }
    }

    getName() {
        return this.appServerDef.name;
    }

    getExecutionDir() {
        return path.resolve(this.path, 'instance');
    }

    getLogDir() {
        return path.resolve(this.path, 'log');
    }

    prepareIo() {
        return new Promise(
            (resolve, reject) => {
                log.info('Preparing server directories');

                fs.mkdir(this.path, err => {
                    if (err && err.code !== 'EEXIST') reject(err);
                    else resolve();
                });
            })

            .then(() => {
                let logDirPromise = new Promise((resolve, reject) => {
                    fs.mkdir(this.getLogDir(), err => {
                        if (err && err.code !== 'EEXIST') reject(err);
                        else resolve();
                    });
                });

                let instanceDirPromise = new Promise((resolve, reject) => {
                    fs.mkdir(this.getExecutionDir(), err => {
                        if (err && err.code !== 'EEXIST') reject(err);
                        else resolve();
                    });
                });

                return Promise.all([logDirPromise, instanceDirPromise]);
            });
    }

    getLogTransports() {
        return [
            new winston.transports.DailyRotateFile({
                filename: path.resolve(this.getLogDir(), 'server'),
                datePattern: '.yyyy-MM-dd.log',
                level: 'debug'
            })
        ];
    }

    handleStdout(line) {
        this.log.info(line);
    }

    handleStderr(line) {
        this.log.error(line);
    }
}

AppServer.loadAll = function () {
    return AppServerModel.findServers()
        .then(servers =>
            Promise.all(servers.map(server => AppServer.load(server))));
};

AppServer.install = function (engineName, name, options) {
    log.info('Installng engine %s for %s', engineName, name);

    let engine = AppServer.getEngine(engineName),
        appServerDef = new AppServerModel({
            name: name,
            engine: engineName,
            port: 8000,
            memory: 1024
        });

    return new Promise(
        (resolve, reject) => {
            appServerDef.save(err => {
                if (err) reject(Error(`Could not save new server ${name} to DB`, err));
                else resolve();
            });
        })

        .then(() => {
            function rollback(err) {
                log.error('Error while installng engine %s for %s - Rollback', engineName, name, err);
                AppServerModel.remove({
                    _id: appServerDef._id // eslint-disable-line no-underscore-dangle
                });
            }

            return engine.install(appServerDef, options)
                .then(appServer => appServer, rollback);
        });
};

AppServer.load = function (serverDef) {
    AppServer.getEngine(serverDef.engine).load(serverDef)
        .then(server => server.run());
};

AppServer.getEngine = function (name) {
    let engine = engines[name];

    if (!engine)
        throw Error(`No server engine named ${name}`);

    // Do the require afterwards!!!
    // Otherwise we have a two way dependency
    return require(engine);
};

module.exports = AppServer;
