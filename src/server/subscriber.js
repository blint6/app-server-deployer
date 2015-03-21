let Promise = require('es6-promise').Promise;
let dispatcher = require('./dispatcher');

let _services = {};

let Subscriber = {

    register: function(room, options) {
        _services[room] = {
            clients: [],
            publish: (typeof options.publish === 'function') && options.publish,
            onSubscribe: (typeof options.onSubscribe === 'function') && options.onSubscribe,
            onFirstSubscriber: (typeof options.onFirstSubscriber === 'function') && options.onFirstSubscriber,
            onAllUnsubscribed: (typeof options.onAllUnsubscribed === 'function') && options.onAllUnsubscribed,
        };
    },

    subscribe: function(room, client) {
        let svc = _services[room];

        if (svc) {
            svc.clients.push(client);
            let chain = Promise.resolve();

            if (svc.clients.length === 1 && svc.onFirstSubscriber)
                chain.then(() => svc.onFirstSubscriber());
            if (svc.onSubscribe)
                chain.then(() => svc.onSubscribe(client));
        }
    },

    unsubscribe: function(room, client) {
        let svc = _services[room];

        if (svc) {
            let i = svc.clients.indexOf(client);

            if (i > -1)
                svc.clients.splice(i, 1);
        }
    },

    publish: function(room, data) {
        let svc = _services[room];

        if (svc)
            return svc.publish(svc.clients, data);
    },

    getClients: function(room) {
        return _services[room] && _services[room].clients;
    }
};

dispatcher.registerClientActions(function(payload) {
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
