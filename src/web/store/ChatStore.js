let EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');
let MinodeDispatcher = require('../dispatcher/MinodeDispatcher');
let ChatConstants = require('../constant/ChatConstants');

let CHANGE_EVENT = 'change';

let _chat;

/**
 * Create a TODO item.
 * @param {string} text The content of the TODO
 */
function addMessages(messages) {
    messages.forEach(message => {

        if (!_chat)
            _chat = {
                initialId: message.id,
                messages: [message]
            };

        else if (message.id >= _chat.initialId + _chat.messages.length)
            _chat.messages.push(message);
    });
}

let ChatStore = assign({}, EventEmitter.prototype, {

    /**
     * Get the entire collection of messages.
     * @return {object}
     */
    getMessages: function() {
        return _chat ? _chat.messages : [];
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    dispatcherIndex: MinodeDispatcher.register(function(payload) {
        let action = payload.action;

        switch (action.actionType) {
            case ChatConstants.NEW_MESSAGES:
                if (action.messages && action.messages.length) {
                    addMessages(action.messages);
                    ChatStore.emitChange();
                }
                break;
        }

        return true;
    })
});

module.exports = ChatStore;
