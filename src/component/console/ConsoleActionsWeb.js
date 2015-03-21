let dispatcher = require('../../web/dispatcher');
let ConsoleConstants = require('./ConsoleConstants');

let ConsoleActions = {

    /**
     * @param  {string} text
     */
    create: function(text) {
        dispatcher.handleViewAction({
            actionType: ConsoleConstants.NEW_MESSAGES,
            text: text
        });
    },

    subscribe: function(serverId) {
    	dispatcher.handleViewAction({
            actionType: 'sub',
            sub: ConsoleConstants.SUB + serverId
        }, true);
    },

    unsubscribe: function(serverId) {
    	dispatcher.handleViewAction({
            actionType: 'unsub',
            sub: ConsoleConstants.SUB + serverId
        }, true);
    },
};

module.exports = ConsoleActions;
