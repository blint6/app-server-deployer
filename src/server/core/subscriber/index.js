let dispatcher = require('../dispatcher');
let Subscriber = require('./Subscriber');

dispatcher.registerClientActions(function (payload) {
    let action = payload.action;

    switch (action.actionType) {
        case 'sub':
            Subscriber.subscribe(action.sub, payload.client);
            break;
        case 'unsub':
            Subscriber.unsubscribe(action.sub, payload.client);
            break;
    }
});

module.exports = Subscriber;
