let MinodeDispatcher = require('../dispatcher/MinodeDispatcher');
let ChatConstants = require('../constant/ChatConstants');

let ChatActions = {

    /**
     * @param  {string} text
     */
    create: function(text) {
        MinodeDispatcher.handleViewAction({
            actionType: ChatConstants.NEW_MESSAGES,
            text: text
        });
    },
}

module.exports = ChatActions;
