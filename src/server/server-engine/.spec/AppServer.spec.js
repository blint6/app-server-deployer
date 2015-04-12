require('should');

let mockgoose = require('mockgoose');
mockgoose(require('mongoose'));

let fs = require('fs');
let path = require('path');
let Promise = require('es6-promise').Promise;
let del = require('del');
let AppServer = require('../AppServer');

describe('AppServer', function () {

    mockgoose.reset();
    let fooServer;

    describe('.getEngine', function () {

        it('should succeed on all known engines', function () {
            AppServer.getEngine('bukkit').should.not.be.empty;
            AppServer.getEngine('test').should.not.be.empty;
        });

        it('should fail on unknown engines', function () {
            AppServer.getEngine.bind(AppServer, 'unknown-engine').should.throwError();
        });
    });

    describe('.install', function () {

        it('should create a raw server properly', function () {
            return AppServer.install('raw', 'foo-server')
                .then(
                    server => {
                    server.should.instanceOf(AppServer);
                    server.should.not.have.property('spawnServer');
                    fooServer = server;
                });
        });
    });

    describe('#run', function () {

        it('should run the server properly', function (done) {
            return fooServer.run()
                .then(() => {
                    done(Error('Should not have spawned a server with no spawnServer method'));
                }, () => done());
        });
    });

    describe('#prepareIo', function () {

        function isDirectory(file) {
            return new Promise((resolve, reject) => {
                fs.stat(file, (err, stats) => {
                    if (err) reject(err);

                    if (stats.isDirectory())
                        resolve();
                    else
                        reject(Error(`${file} is not a directory`));
                });
            });
        }

        function clean() {
            return new Promise(resolve => {
                del(fooServer.path, {
                    force: true
                }, resolve);
            });
        }

        it('should generate server folders', function () {
            return clean()
                .then(() => {
                    return fooServer.prepareIo(fooServer);
                })
                .then(() => {
                    return Promise.all([
                        isDirectory(fooServer.path),
                        isDirectory(fooServer.getLogDir()),
                        isDirectory(fooServer.getExecutionDir())
                    ]);
                })
                .then(clean, err => {
                    clean();
                    throw err;
                });
        });
    });

    describe('#sendMessage', function () {

        it('should not be able to send messages to the underlying process', function () {
            fooServer.sendMessage.bind(fooServer, 'message to underlying process')
                .should.throwError();
        });
    });

    describe('#getName', function () {

        it('should get the name of the server from its configuration', function () {
            fooServer.getName().should.equal('foo-server');
        });
    });

    describe('#getExecutionDir', function () {

        it('should resolve the server execution directory', function () {
            fooServer.getExecutionDir().should.equal(path.resolve('foo-server', 'instance'));
        });
    });

    describe('#getLogDir', function () {

        it('should return logs directory', function () {
            fooServer.getLogDir().should.equal(path.resolve('foo-server', 'log'));
        });
    });

    describe('.loadAll', function () {

        it('should load previously used servers', function () {
            return AppServer.loadAll()
                .then(servers => {
                    servers.should.be.instanceOf(Array);
                    servers.length.should.equal(1);
                    servers[0].getName().should.equal('foo-server');
                    servers[0].appServerDef.engine.should.equal('raw');
                });
        });
    });
});
