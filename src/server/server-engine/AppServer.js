let fs = require('fs');
let path = require('path');
let EventEmitter = require('events').EventEmitter;
let Promise = require('es6-promise').Promise;
let tailFile = require('../fs/tailFile');
let AppServerModel = require('./AppServerModel');
let ConsoleActions = require('minode/component/console/ConsoleActionsSrv');

let engines = {
    bukkit: './bukkit/BukkitServer',
};


class AppServer extends EventEmitter {

    constructor(serverDef) {
        this.appServerDef = serverDef;
        this.path = serverDef.name.replace(/[\/\\]/g, '_');
    }

    run() {
        if (this.process) {
            throw Error('Cannot start server, already running');
        }

        this.createServerFolders()

            .then(() => {
                console.log('Preparing log files');
                return Promise.all([
                    'pipe',
                    new Promise((resolve, reject) => fs.open(this.getServerLog(), 'a', '0772', (err, stream) => {
                        if (err) reject(err);
                        else resolve(stream);
                    })),
                    new Promise((resolve, reject) => fs.open(this.getErrorLog(), 'a', '0772', (err, stream) => {
                        if (err) reject(err);
                        else resolve(stream);
                    }))
                ]).then(stdio => {
                    this.stdio = stdio;
                });
            })

            .then(() => {
                console.info('Spawning server process');
                this.process = this.spawnServer();

                // Process terminated
                this.process.on('close', function (code, signal) {
                    delete this.process;

                    if (typeof this.handleClose === 'function')
                        this.handleClose(code, signal);
                }.bind(this));

                // Log notifier
                ConsoleActions.registerServer(this);
            })

            .then(() => {
                console.info('Server process started');
            }, err => {
                console.error('Failed to start the server', err);
            });
    }

    sendMessage(message) {
        //console.log(JSON.stringify(this.stdio[0]))
        this.process.stdio[0].write(message + '\n');
    }

    stop() {
        if (this.process) {
            console.info('Terminating server');
            this.process.kill();
        }
    }

    handleClose(code, signal) {
        if (code === 0) {
            if (signal)
                console.info('Server closed - got signal', signal);
            else
                console.info('Server closed successfully');
        } else
            console.error('Server exited with code', code);
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

    getServerLog() {
        return path.resolve(this.path, 'log/server.log');
    }

    getErrorLog() {
        return path.resolve(this.path, 'log/error.log');
    }

    getLogs(fromId, nLines) {
        if (arguments.length < 3) {
            nLines = fromId;
            fromId = 0;
        }

        return tailFile(this.getServerLog(), fromId, nLines);
    }

    createServerFolders() {
        return new Promise((resolve, reject) => {
            console.log('Preparing server directories');

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
}

AppServer.loadAll = function () {
    return AppServerModel.findServers()
        .then(servers =>
            Promise.all(servers.map(server => AppServer.load(server))));
};

AppServer.install = function (engineName, name, options) {
    console.info('Installng engine', engineName, 'for', name);

    let engine = AppServer.getEngine(engineName),
        appServerDef = new AppServerModel({
            name: name,
            engine: engineName,
            port: 8000,
            memory: 1024
        });

    return new Promise((resolve, reject) => {
        appServerDef.save(err => {
            if (err) reject(Error(`Could not save new server ${name} to DB`, err));
            else resolve();
        });
    })
        .then(() => {
            function rollback(err) {
                console.error('Error while installng engine', engineName, 'for', name, '- Rollback', err.stack);
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
