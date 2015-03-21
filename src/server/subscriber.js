let dispatcher = require('./dispatcher');

let _services = {};

let Subscriber = {

    register: function(room, cb) {
        _services[room] = {
            clients: [],
            cb: cb
        };
    },

    subscribe: function(room, client) {
        if (_services[room])
            _services[room].clients.push(client);
    },

    unsubscribe: function(room, client) {
        if (_services[room]) {
            let i = _services[room].clients.indexOf(client);

            if (i > -1)
                _services[room].clients.splice(i, 1);
        }
    },

    publish: function(room, data) {
        if (_services[room])
            return _services[room].cb(_services[room].clients, data);
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
