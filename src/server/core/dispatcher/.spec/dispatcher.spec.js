require('should');
let sinon = require('sinon');

let dispatcher = require('..');
let registeredIds = [];

let serviceActionsCb = sinon.spy();
let clientActionsCb = sinon.spy();
let clientConnectionsCb = sinon.spy();

describe('MinodeServerDispatcher', function () {

    describe('#registerServiceActions', function () {

        it('should register a callback for service actions', function () {
            let cbId = dispatcher.registerServiceActions(serviceActionsCb);
            registeredIds.should.not.containEql(cbId);
            registeredIds.push(cbId);
        });
    });

    describe('#handleServiceAction', function () {

        it('should dispatch service actions properly', function () {
            let action = {
                actionType: 'SPEC handleServiceAction',
                data: {
                    random: true
                }
            };

            dispatcher.handleServiceAction(action);
            dispatcher.handleServiceAction(action, 'random client');

            serviceActionsCb.callCount.should.equal(2);

            sinon.assert.calledWith(serviceActionsCb.firstCall, {
                source: 'SERVICE_ACTION',
                client: undefined,
                action: action
            });

            sinon.assert.calledWith(serviceActionsCb.secondCall, {
                source: 'SERVICE_ACTION',
                client: 'random client',
                action: action
            });
        });

        it('should break with no action provided', function () {
            dispatcher.handleServiceAction.bind(dispatcher).should.throwError();
        });
    });

    describe('#registerClientActions', function () {

        it('should register a callback for client actions with a new ID', function () {
            let cbId = dispatcher.registerClientActions(clientActionsCb);
            registeredIds.should.not.containEql(cbId);
            registeredIds.push(cbId);
        });
    });

    describe('#handleClientAction', function () {

        it('should dispatch client actions properly', function () {
            let action = {
                actionType: 'SPEC handleClientAction',
                data: {
                    random: true
                }
            };

            dispatcher.handleClientAction('some client', action);
            dispatcher.handleClientAction('some other client', action);

            clientActionsCb.callCount.should.equal(2);

            sinon.assert.calledWith(clientActionsCb.firstCall, {
                source: 'CLIENT_ACTION',
                client: 'some client',
                action: action
            });

            sinon.assert.calledWith(clientActionsCb.secondCall, {
                source: 'CLIENT_ACTION',
                client: 'some other client',
                action: action
            });
        });

        it('should break with no action provided', function () {
            dispatcher.handleClientAction.bind(dispatcher, 'some client').should.throwError();
        });
    });

    describe('#registerClientConnections', function () {

        it('should register a callback for client connections with a new ID', function () {
            let cbId = dispatcher.registerClientConnections(clientConnectionsCb);
            registeredIds.should.not.containEql(cbId);
            registeredIds.push(cbId);
        });
    });

    describe('#handleClientConnection', function () {

        it('should dispatch client connections properly', function () {
            dispatcher.handleClientConnection('new client');

            clientConnectionsCb.callCount.should.equal(1);

            sinon.assert.calledWith(clientConnectionsCb, {
                source: 'CLIENT_CONNECTION',
                client: 'new client',
            });
        });
    });
});
