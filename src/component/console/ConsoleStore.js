let EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');
let dispatcher = require('../../web/dispatcher');
let ConsoleConstants = require('./ConsoleConstants');

let CHANGE_EVENT = 'change';

let chat;

function addMessages(messages) {
    if (!chat)
        chat = {
            initialId: 0,
            lastId: -1,
            messages: []
        };

    messages.forEach(message => {
        chat.lastId += 1;
        message.id = chat.lastId;
        chat.messages.push(message);
    });
}

let ChatStore = assign({}, EventEmitter.prototype, {

    /**
     * Get the entire collection of messages.
     * @return {object}
     */
    getMessages: function () {
        return chat ? chat.messages : [];
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    dispatcherIndex: dispatcher.register(function (payload) {
        let action = payload.action;

        switch (action.actionType) {
            case ConsoleConstants.NEW_MESSAGES:
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
