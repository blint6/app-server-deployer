let log = require('../logger');
let Promise = require('es6-promise').Promise;

let services = {};

let Subscriber = {

    register: function (room, options) {
        services[room] = {
            clients: [],
            publish: (typeof options.publish === 'function') && options.publish,
            onSubscribe: (typeof options.onSubscribe === 'function') && options.onSubscribe,
            onFirstSubscriber: (typeof options.onFirstSubscriber === 'function') && options.onFirstSubscriber,
            onAllUnsubscribed: (typeof options.onAllUnsubscribed === 'function') && options.onAllUnsubscribed,
        };
    },

    subscribe: function (room, client) {
        let svc = services[room];

        if (!svc)
            throw Error(`No room named ${room}`);

        svc.clients.push(client);
        let chain = Promise.resolve();

        if (svc.clients.length === 1 && svc.onFirstSubscriber)
            chain.then(() => svc.onFirstSubscriber());
        if (svc.onSubscribe)
            chain.then(() => svc.onSubscribe(client));

        return chain;
    },

    unsubscribe: function (room, client) {
        let svc = services[room];

        if (!svc)
            throw Error(`No room named ${room}`);

        let i = svc.clients.indexOf(client);

        if (i > -1) {
            svc.clients.splice(i, 1);

            if (!svc.clients.length)
                svc.onAllUnsubscribed();
        }
    },

    publish: function (room, data) {
        let svc = services[room];

        if (!svc)
            throw Error(`No room named ${room}`);

        if (svc.publish)
            return svc.publish(svc.clients, data);
        else
            log.warn('No publish handler was setup for %s', room);
    },

    getClients: function (room) {
        let svc = services[room];

        if (!svc)
            throw Error(`No room named ${room}`);

        return svc.clients;
    }
};

module.exports = Subscriber;
