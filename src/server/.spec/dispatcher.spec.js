require('should');
let sinon = require('sinon');

let dispatcher = require('../dispatcher');
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

            dispatcher.handleServiceAction();
            dispatcher.handleServiceAction(action);
            dispatcher.handleServiceAction(action, 'random client');

            serviceActionsCb.callCount.should.be.exactly(3);

            sinon.assert.calledWith(serviceActionsCb.firstCall, {
                source: 'SERVICE_ACTION',
                client: undefined,
                action: undefined
            });

            sinon.assert.calledWith(serviceActionsCb.secondCall, {
                source: 'SERVICE_ACTION',
                client: undefined,
                action: action
            });

            sinon.assert.calledWith(serviceActionsCb.thirdCall, {
                source: 'SERVICE_ACTION',
                client: 'random client',
                action: action
            });
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

            dispatcher.handleClientAction('some client');
            dispatcher.handleClientAction('some client', action);

            clientActionsCb.callCount.should.be.exactly(2);

            sinon.assert.calledWith(clientActionsCb.firstCall, {
                source: 'CLIENT_ACTION',
                client: 'some client',
                action: undefined
            });

            sinon.assert.calledWith(clientActionsCb.secondCall, {
                source: 'CLIENT_ACTION',
                client: 'some client',
                action: action
            });
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

            clientConnectionsCb.callCount.should.be.exactly(1);

            sinon.assert.calledWith(clientConnectionsCb, {
                source: 'CLIENT_CONNECTION',
                client: 'new client',
            });
        });
    });
});
