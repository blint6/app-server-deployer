let Promise = require('es6-promise').Promise;
let Tail = require('tail').Tail;
let dispatcher = require('../../server/dispatcher');
let subscriber = require('../../server/subscriber');
let countLines = require('../../server/fs/countLines');
let tailFile = require('../../server/fs/tailFile');
let ConsoleConstants = require('./ConsoleConstants');


let ConsoleActions = {

    registerServer: function(server) {
        let room = ConsoleConstants.SUB + server.path;
        let tail, lineCount;

        subscriber.register(room, {

            onSubscribe: function(client) {
                tailFile(server.getLog(), 100)

                .then(lines =>
                    dispatcher.handleServiceAction({
                        actionType: ConsoleConstants.NEW_MESSAGES,
                        messages: lines
                    }, client));
            },

            onFirstSubscriber: function() {

                let promise = countLines(server.getLog())

                .then(function(count) {
                    lineCount = count;

                    if (tail)
                        tail.watch();
                    else
                        tail = new Tail(server.getLog());

                    tail.on('line', function(data) {
                        lineCount += 1;
                        subscriber.publish(room, {
                            id: lineCount,
                            content: data
                        });
                    });
                });

                return promise;
            },

            publish: function(clients, message) {
                dispatcher.handleServiceAction({
                    actionType: ConsoleConstants.NEW_MESSAGES,
                    messages: [message]
                }, clients);
            },

            onAllUnsubscribed: function() {
                if (tail)
                    tail.unwatch();
            },
        });

        dispatcher.registerClientActions(function(payload) {
            let action = payload.action;
            if (action.actionType === ConsoleConstants.SEND_MESSAGE && action.serverId === server.getName()) {
                server.sendMessage(action.message);
            }
        });
    },
};

module.exports = ConsoleActions;
