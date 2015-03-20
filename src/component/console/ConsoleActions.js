let MinodeDispatcher = require('../../web/dispatcher/MinodeDispatcher');
let ConsoleConstants = require('./ConsoleConstants');

let ConsoleActions = {

    /**
     * @param  {string} text
     */
    create: function(text) {
        MinodeDispatcher.handleViewAction({
            actionType: ConsoleConstants.NEW_MESSAGES,
            text: text
        });
    },
}

module.exports = ConsoleActions;
