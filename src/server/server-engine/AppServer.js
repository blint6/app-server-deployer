let fs = require('fs');
let path = require('path');
let EventEmitter = require('events').EventEmitter;
let Promise = require('es6-promise').Promise;


class AppServer extends EventEmitter {

    run() {
        if (this.process) {
            throw Error('Cannot start server, already running');
        }

        this.createServerFolders()
            .then(() => {
                console.log('Preparing log files');
                return Promise.all([
                    0,
                    new Promise((resolve, reject) => fs.open(this.getLog(), 'a', '0772', (err, stream) => {
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
                this.process.on('close', function(code, signal) {
                    delete this.process;

                    if (typeof this.handleClose === 'function')
                        this.handleClose(code, signal);
                }.bind(this));
            })
            .then(() => {
                console.info('Server process started');
            }, err => {
                console.error('Failed to start the server', err);
            });
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

    getExecutionDir() {
        return path.resolve(this.path, 'instance');
    }

    getLogDir() {
        return path.resolve(this.path, 'log');
    }

    getLog() {
        return path.resolve(this.path, 'log/server.log');
    }

    getErrorLog() {
        return path.resolve(this.path, 'log/error.log');
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

module.exports = AppServer;
