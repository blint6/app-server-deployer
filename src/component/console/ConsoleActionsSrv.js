let log = require('../../server/core/logger');
let dispatcher = require('../../server/core/dispatcher');
let subscriber = require('../../server/core/subscriber');
let countLines = require('../../server/fs/countLines');
let ConsoleConstants = require('./ConsoleConstants');

let N_LAST_LOGS = 100;

let ConsoleActions = {

    register: function () {
        dispatcher.registerServiceActions(function (payload) {
            let action = payload.action;

            if (action.actionType === 'AppServer#run') {
                let server = action.server;
                let room = ConsoleConstants.SUB + server.path;
                let lastLogs = [];

                subscriber.register(room, {

                    onSubscribe: function (client) {
                        log.debug('New client subscribing to %s console', server.getName());
                        dispatcher.handleServiceAction({
                            actionType: ConsoleConstants.NEW_MESSAGES,
                            server: server.getName(),
                            messages: lastLogs
                        }, client);
                    },

                    publish: function (clients, message) {
                        log.debug('%s sending clients: %s', server.getName(), JSON.stringify(message));
                        dispatcher.handleServiceAction({
                            actionType: ConsoleConstants.NEW_MESSAGES,
                            server: server.getName(),
                            messages: [message]
                        }, clients);
                    },
                });

                server.log.on('logging', function (transport, level, msg, meta) {
                    if (transport.name === 'console') {
                        var logMsg = {
                            level, message: msg, meta
                        };

                        subscriber.publish(room, logMsg);

                        lastLogs.push(logMsg);

                        if (lastLogs.length > N_LAST_LOGS)
                            lastLogs.shift();
                    }
                });

                dispatcher.registerClientActions(function (payload) {
                    let action = payload.action;

                    if (action.actionType === ConsoleConstants.SEND_MESSAGE && action.serverId === server.getName()) {
                        log.debug('Received client message in server %s console', server.getName(), action);
                        server.sendMessage(action.message);
                    }
                });
            }
        });
    },
};

module.exports = ConsoleActions;
