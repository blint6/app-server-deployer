let dispatcher = require('../../server/core/dispatcher');
let subscriber = require('../../server/core/subscriber');
let countLines = require('../../server/fs/countLines');
let ConsoleConstants = require('./ConsoleConstants');


let ConsoleActions = {

    registerServer: function (server) {
        let room = ConsoleConstants.SUB + server.path;

        subscriber.register(room, {

            onSubscribe: function (client) {
                server.log.query({limit: 100, start: -100}, (err, lines) => {
                    if (err) throw err;

                    dispatcher.handleServiceAction({
                        actionType: ConsoleConstants.NEW_MESSAGES,
                        messages: lines
                    }, client);
                });
            },

            publish: function (clients, message) {
                dispatcher.handleServiceAction({
                    actionType: ConsoleConstants.NEW_MESSAGES,
                    messages: [message]
                }, clients);
            },
        });

        server.log.stream({start: -1}).on('log', function (log) {
            subscriber.publish(room, log);
        });

        dispatcher.registerClientActions(function (payload) {
            let action = payload.action;
            if (action.actionType === ConsoleConstants.SEND_MESSAGE && action.serverId === server.getName()) {
                server.sendMessage(action.message);
            }
        });
    },
};

module.exports = ConsoleActions;
