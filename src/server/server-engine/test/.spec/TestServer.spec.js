require('should');

let Promise = require('es6-promise').Promise;
let sinon = require('sinon');
let dispatcher = require('../../../core/dispatcher');
let AppServer = require('../../AppServer');
let TestServer = require('../TestServer');

let fooServer, barServer;

describe('TestServer', function () {

    describe('.install', function () {

        it('should create a test server properly', function () {
            return Promise.all([
                AppServer.install('./test/TestServer', 'test-server'),
                AppServer.install('./test/TestServer', 'bar-server')
            ])
                .then(servers => {
                    servers[0].should.instanceOf(TestServer);
                    servers[1].should.instanceOf(TestServer);
                    fooServer = servers[0];
                    barServer = servers[1];
                });
        });
    });

    describe('#run', function () {

        it('should run the server properly', function () {
            let cb = sinon.spy();
            dispatcher.registerServiceActions(cb);

            return fooServer.run()
                .then(() => {
                    sinon.assert.calledOnce(cb);
                    cb.firstCall.args[0].should.have.property('action', {
                        actionType: 'AppServer#run',
                        server: fooServer
                    });
                    cb.reset();
                })
                .then(() => barServer.run())
                .then(() => {
                    sinon.assert.calledOnce(cb);
                    cb.firstCall.args[0].should.have.property('action', {
                        actionType: 'AppServer#run',
                        server: barServer
                    });
                    cb.reset();
                });
        });

        it('should fail if attempted to be run while already running', function () {
            fooServer.run.bind(fooServer).should.throwError(/already running/);
        });
    });

    describe('#stop', function () {

        it('should stop the server normally, code 0', function () {
            return fooServer.stop()
                .then(returned => {
                    returned.should.have.property('code', 0);
                });
        });
    });
});

describe('AppServer', function () {

    describe('#sendMessage', function () {

        it('should send messages to the underlying process', function () {
            return new Promise(resolve => {
                let listener = barServer.registerOnNewLine(line => {
                    barServer.unregisterOnNewLine(listener);
                    line.should.equal('Received: message to underlying process');
                    resolve();
                });

                barServer.sendMessage('message to underlying process');
            });
        });

        it('should log message in stderr', function () {
            return new Promise(resolve => {
                let listener = barServer.registerOnNewError(line => {
                    barServer.unregisterOnNewError(listener);
                    line.should.equal('Sample error');
                    resolve();
                });

                barServer.sendMessage('error');
            });
        });
    });

    describe('#stop', function () {

        it('should kill the server', function () {
            return AppServer.prototype.stop.call(barServer)
                .then(returned => {
                    if (returned.hasOwnProperty('code'))
                        returned.code.should.equal(143);
                    else if (returned.hasOwnProperty('signal'))
                        returned.signal.should.equal('SIGTERM');
                    else
                        throw Error('Did not return expected code or signal');
                });
        });
    });
});
