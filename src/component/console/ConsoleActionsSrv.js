let Tail = require('tail').Tail;
let dispatcher = require('../../server/core/dispatcher');
let subscriber = require('../../server/core/subscriber');
let countLines = require('../../server/fs/countLines');
let ConsoleConstants = require('./ConsoleConstants');


let ConsoleActions = {

    registerServer: function (server) {
        let room = ConsoleConstants.SUB + server.path;
        let tail, lineCount;

        subscriber.register(room, {

            onSubscribe: function (client) {
                server.getLogs(100)
                    .then(lines =>
                        dispatcher.handleServiceAction({
                            actionType: ConsoleConstants.NEW_MESSAGES,
                            messages: lines
                        }, client));
            },

            onFirstSubscriber: function () {

                let promise = countLines(server.getServerLog())

                    .then(function (count) {
                        lineCount = count;

                        if (tail)
                            tail.watch();
                        else
                            tail = new Tail(server.getServerLog());

                        tail.on('line', function (data) {
                            lineCount += 1;
                            subscriber.publish(room, {
                                id: lineCount,
                                content: data
                            });
                        });
                    });

                return promise;
            },

            publish: function (clients, message) {
                dispatcher.handleServiceAction({
                    actionType: ConsoleConstants.NEW_MESSAGES,
                    messages: [message]
                }, clients);
            },

            onAllUnsubscribed: function () {
                if (tail)
                    tail.unwatch();
            },
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
