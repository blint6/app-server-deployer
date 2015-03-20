let MinodeDispatcher = require('../../server/dispatcher');
let ConsoleConstants = require('./ConsoleConstants');

let ConsoleActions = {

    /**
     * @param  {integer} id
     * @param  {Array} content
     */
    newMessages: function(clients, id, content) {
        MinodeDispatcher.handleServiceAction({
            actionType: ConsoleConstants.NEW_MESSAGES,
            messages: [{
                id: id,
                content: content
            }]
        }, clients);
    },
};

module.exports = ConsoleActions;
