require('should');

let Promise = require('es6-promise').Promise;
let sinon = require('sinon');
let Dispatcher = require('../Dispatcher');
let dispatcher = new Dispatcher();

describe('Dispatcher', function () {

    let registered = [];
    let cb1 = sinon.spy(),
        cb2 = function (payload) {
            if (payload.action === 'ERROR')
                throw Error('Oh snap we got an error');
        },
        cb3 = sinon.spy(),
        cb4 = function (payload) {
            if (payload.action === 'REJECT')
                return new Promise((resolve, reject) => reject(Error('Oh snap, promise rejected')));
        },
        cb5 = sinon.spy();

    beforeEach(function () {
        cb1.reset();
        cb3.reset();
    });

    describe('#register', function () {

        it('should register a callback and return an ID', function () {
            registered.push(dispatcher.register(cb1));
            registered.push(dispatcher.register(cb2));
            registered.push(dispatcher.register(cb3));
            registered.push(dispatcher.register(cb4));
            registered.push(dispatcher.register(cb5));

            registered.forEach(id => id.should.be.instanceOf(Number));
        });
    });

    describe('#dispatch', function () {

        it('should trigger registered methods', function () {
            let payload = {action: 'any-action', data: 1234};
            return dispatcher.dispatch(payload)
                .then(() => {
                    sinon.assert.calledWith(cb1, payload);
                    sinon.assert.calledWith(cb3, payload);
                    sinon.assert.calledWith(cb5, payload);
                });
        });

        it('should catch errors', function () {
            let payload = {action: 'ERROR', data: 1111};
            return dispatcher.dispatch(payload)
                .then(() => {
                    throw Error('dispatcher should not succeed');
                }, (err) => {
                    err.message.should.equal('Oh snap we got an error');
                    sinon.assert.calledWith(cb1, payload);
                    sinon.assert.calledWith(cb3, payload);
                    sinon.assert.calledWith(cb5, payload);
                });
        });

        it('should catch rejected promises', function () {
            let payload = {action: 'REJECT', data: 1111};
            return dispatcher.dispatch(payload)
                .then(() => {
                    throw Error('dispatcher should not succeed');
                }, (err) => {
                    err.message.should.equal('Oh snap, promise rejected');
                    sinon.assert.calledWith(cb1, payload);
                    sinon.assert.calledWith(cb3, payload);
                    sinon.assert.calledWith(cb5, payload);
                });
        });
    });

    describe('#unregister', function () {

        it('should unregister a callback properly', function () {
            dispatcher.unregister(registered[0]);
            let payload = {action: 'not-for-cb1', data: 4321};
            return dispatcher.dispatch(payload)
                .then(() => {
                    sinon.assert.notCalled(cb1);
                    sinon.assert.calledWith(cb3, payload);
                    sinon.assert.calledWith(cb5, payload);
                });
        });

        it('should unregister two callbacks properly', function () {
            dispatcher.unregister(registered[2]);
            let payload = {action: 'not-for-cb3', data: 4321};
            return dispatcher.dispatch(payload)
                .then(() => {
                    sinon.assert.notCalled(cb1);
                    sinon.assert.notCalled(cb3);
                    sinon.assert.calledWith(cb5, payload);
                });
        });
    });
});
