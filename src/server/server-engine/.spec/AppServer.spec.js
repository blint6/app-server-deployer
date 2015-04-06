require('should');

let path = require('path');
let Promise = require('es6-promise').Promise;
let TestServer = require('../test/TestServer');

describe('AppServer', function () {

    let fooServer = TestServer.load('foo-server');

    describe('#run', function () {

        it('should run the server properly', function () {
            fooServer.run();
        });
    });

    describe('#sendMessage', function () {

        it('should send messages to the underlying process', function () {
            return new Promise(resolve => {
                let listener = fooServer.registerOnNewLine(line => {
                    fooServer.unregisterOnNewLine(listener);
                    line.should.equal('Received: message to underlying process');
                    resolve();
                });

                fooServer.sendMessage('message to underlying process');
            });
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

        it('should', function () {
            fooServer.getLogDir().should.equal(path.resolve('foo-server', 'log'));
        });
    });

    describe('#stop', function () {

        it('should stop the server properly', function () {
            return fooServer.stop()
                .then(code => code.should.equal('SIGTERM'),
                    err => {
                    throw err;
                });
        });
    });
});
