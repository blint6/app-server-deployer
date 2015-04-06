let log = require('../../server/core/logger');
let dispatcher = require('../../server/core/dispatcher');
let subscriber = require('../../server/core/subscriber');
let countLines = require('../../server/fs/countLines');
let ConsoleConstants = require('./ConsoleConstants');


let ConsoleActions = {

    registerServer: function (server) {
        let room = ConsoleConstants.SUB + server.path;

        subscriber.register(room, {

            onSubscribe: function (client) {
                log.debug('New client subscribing to %s console', server.getName());
                server.log.query({limit: 100, start: -100}, (err, lines) => {
                    if (err) throw err;

                    console.log(lines);
                    log.debug('%s sending %d lines to new client', server.getName(), lines.length);

                    dispatcher.handleServiceAction({
                        actionType: ConsoleConstants.NEW_MESSAGES,
                        messages: lines
                    }, client);
                });
            },

            publish: function (clients, message) {
                log.debug('%s sending clients: ', server.getName(), message);
                dispatcher.handleServiceAction({
                    actionType: ConsoleConstants.NEW_MESSAGES,
                    messages: [message]
                }, clients);
            },
        });

        server.log.stream({start: -1}).on('log', function (log) {
            log.debug('%s server emitted %s', server.getName(), action);
            subscriber.publish(room, log);
        });

        dispatcher.registerClientActions(function (payload) {
            let action = payload.action;

            if (action.actionType === ConsoleConstants.SEND_MESSAGE && action.serverId === server.getName()) {
                log.debug('Received client message in server %s console', server.getName(), action);
                server.sendMessage(action.message);
            }
        });
    },
};

module.exports = ConsoleActions;
