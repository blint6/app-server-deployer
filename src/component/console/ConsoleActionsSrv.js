let Tail = require('tail').Tail;
let dispatcher = require('../../server/dispatcher');
let subscriber = require('../../server/subscriber');
let ConsoleConstants = require('./ConsoleConstants');

let ConsoleActions = {

    registerServer: function(server) {
        let room = ConsoleConstants.SUB + server.path;

        subscriber.register(room, function(clients, message) {
            dispatcher.handleServiceAction({
                actionType: ConsoleConstants.NEW_MESSAGES,
                messages: [message]
            }, clients);
        });

        let tail = new Tail(server.getLog()),
            i = 0;

        tail.on('line', function(data) {
            subscriber.publish(room, {
                id: i,
                content: data
            });
            i += 1;
        });
    },
};

module.exports = ConsoleActions;
