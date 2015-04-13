let EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');
let dispatcher = require('../../web/dispatcher');
let ConsoleConstants = require('./ConsoleConstants');

let CHANGE_EVENT = 'change';

let chat = {};

function addMessages(server, messages) {
    if (!chat[server])
        chat[server] = {
            initialId: 0,
            lastId: -1,
            messages: []
        };

    messages.forEach(message => {
        chat[server].lastId += 1;
        message.id = chat[server].lastId;
        chat[server].messages.push(message);
    });
}

let ChatStore = assign({}, EventEmitter.prototype, {

    /**
     * Get the entire collection of messages.
     * @return {object}
     */
    getMessages: function (server) {
        return chat[server] ? chat[server].messages : [];
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

    clearMessages: function (server) {
        if (chat[server])
            delete chat[server];
    },

    dispatcherIndex: dispatcher.register(function (payload) {
        let action = payload.action;

        switch (action.actionType) {
            case ConsoleConstants.NEW_MESSAGES:
                if (action.server) {
                    if (action.messages && action.messages.length) {
                        addMessages(action.server, action.messages);
                        ChatStore.emitChange();
                    }
                } else {
                    console.warn('Console message received but no server name was provided');
                }
                break;
        }

        return true;
    })
});

module.exports = ChatStore;
