require('should');
let sinon = require('sinon');
let Promise = require('es6-promise').Promise;

let Subscriber = require('../Subscriber');

let room = {

    r1: {
        publish: sinon.spy(),
        onSubscribe: sinon.spy(),
        onFirstSubscriber: sinon.spy(),
        onAllUnsubscribed: sinon.spy(),
    },

    r2: {
        publish: sinon.spy(),
        onSubscribe: sinon.spy(),
        onFirstSubscriber: sinon.spy(),
        onAllUnsubscribed: sinon.spy(),
    },

    dummyRoom: {},
};

describe('Subscriber', function () {

    describe('#register', function () {

        it('should register operations definition for given rooms', function () {
            Subscriber.register('r1', room.r1);
            Subscriber.register('r2', room.r2);
            Subscriber.register('dummyRoom', room.dummyRoom);
            Subscriber.register('emptyRoom', room.dummyRoom);
        });

        it('should fail on invalid room names', function () {
            Subscriber.register.bind(Subscriber, null)
                .should.throwError();
            Subscriber.register.bind(Subscriber)
                .should.throwError();
        });
    });

    describe('#subscribe', function () {

        it('should call subscribe callbacks properly', function () {
            return Promise
                .all([
                    Subscriber.subscribe('r1', 'c1'),
                    Subscriber.subscribe('r2', 'c21'),
                    Subscriber.subscribe('r2', 'c22'),
                    Subscriber.subscribe('dummyRoom', 'cd1'),
                    Subscriber.subscribe('dummyRoom', 'cd2'),
                    Subscriber.subscribe('dummyRoom', 'cd3')
                ])
                .then(() => {
                    sinon.assert.calledOnce(room.r1.onFirstSubscriber);
                    sinon.assert.calledOnce(room.r1.onSubscribe);
                    sinon.assert.callOrder(room.r1.onFirstSubscriber, room.r1.onSubscribe);
                    sinon.assert.calledOnce(room.r2.onFirstSubscriber);
                    sinon.assert.calledTwice(room.r2.onSubscribe);

                    sinon.assert.calledWith(room.r1.onFirstSubscriber);
                    sinon.assert.calledWith(room.r1.onSubscribe, 'c1');
                    sinon.assert.notCalled(room.r1.publish);
                    sinon.assert.notCalled(room.r1.onAllUnsubscribed);

                    sinon.assert.calledWith(room.r2.onFirstSubscriber);
                    sinon.assert.calledWith(room.r2.onSubscribe.getCall(0), 'c21');
                    sinon.assert.calledWith(room.r2.onSubscribe.getCall(1), 'c22');
                });
        });

        it('should fail on non-existing rooms', function () {
            Subscriber.subscribe.bind(Subscriber, 'not-a-room', 'random guy')
                .should.throwError();
        });
    });

    describe('#unsubscribe', function () {

        it('should call unsubscribe callbacks properly', function () {
            Subscriber.unsubscribe('r1', 'c1');
            Subscriber.unsubscribe('r2', 'c21');
            Subscriber.unsubscribe('dummyRoom', 'cd2');

            sinon.assert.calledOnce(room.r1.onAllUnsubscribed);
            sinon.assert.calledWith(room.r1.onAllUnsubscribed);
            sinon.assert.notCalled(room.r2.onAllUnsubscribed);

            room.r1.onSubscribe.reset();
            room.r1.onFirstSubscriber.reset();
            room.r1.onAllUnsubscribed.reset();

            return Subscriber.subscribe('r1', 'c12')
                .then(() => {
                    sinon.assert.calledOnce(room.r1.onFirstSubscriber);
                    sinon.assert.calledOnce(room.r1.onSubscribe);
                });
        });

        it('should fail on non-existing rooms', function () {
            Subscriber.unsubscribe.bind(Subscriber, 'not-a-room', 'random guy')
                .should.throwError();
        });

        it('should not fail while removing non-existing guys', function () {
            Subscriber.unsubscribe('dummyRoom', 'random guy');
        });
    });

    describe('#publish', function () {

        it('should call registered publishes', function () {
            Subscriber.publish('r1', 'data for r1');
            Subscriber.publish('r2', 'data for r2');
            Subscriber.publish('dummyRoom', 'data for dummyRoom');
            Subscriber.publish('emptyRoom', 'data for emptyRoom');

            sinon.assert.calledOnce(room.r1.publish);
            sinon.assert.calledOnce(room.r2.publish);

            sinon.assert.calledWith(room.r1.publish, ['c12'], 'data for r1');
            sinon.assert.calledWith(room.r2.publish, ['c22'], 'data for r2');
        });

        it('should fail on non-existing rooms', function () {
            Subscriber.publish.bind(Subscriber, 'not-a-room', 'random data')
                .should.throwError();
        });
    });

    describe('#getClients', function () {

        it('should the number of clients registered to a room', function () {
            Subscriber.getClients('r1').should.eql(['c12']);
            Subscriber.getClients('r2').should.eql(['c22']);
            Subscriber.getClients('dummyRoom').should.eql(['cd1', 'cd3']);
            Subscriber.getClients('emptyRoom').should.eql([]);
        });

        it('should fail on non-existing rooms', function () {
            Subscriber.getClients.bind(Subscriber, 'not-a-room')
                .should.throwError();
        });
    });
});
