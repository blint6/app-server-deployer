let Dispatcher = require('../common/dispatcher/Dispatcher');
let assign = require('object-assign');

let MinodeServerDispatcher = assign({}, Dispatcher.prototype, {

    /**
     * A bridge function between the services and the dispatcher, marking the action
     * as a view action.  Another variant here could be handleServerAction.
     * @param  {object} action The data coming from the view.
     * @param  {boolean} sendToClient If the payload should be sent to the client.
     */
    handleServiceAction: function(action, client) {
        this.dispatch({
            source: 'SERVICE_ACTION',
            client: client,
            action: action
        });
    },

    registerServiceActions: function(cb) {
        return this.register(function(payload) {
            if (payload.source === 'SERVICE_ACTION') {
                return cb(payload, payload.action);
            }

            return true;
        });
    },

    /**
     * A bridge function between the client and the dispatcher.
     * @param  {object} action The data coming from the view.
     */
    handleClientAction: function(client, action) {
        this.dispatch({
            source: 'CLIENT_ACTION',
            client: client,
            action: action
        });
    },

    registerClientActions: function(cb) {
        return this.register(function(payload) {
            if (payload.source === 'CLIENT_ACTION') {
                return cb(payload, payload.action);
            }

            return true;
        });
    },

    /**
     * Handler for client connections.
     * @param  {object} action The data coming from the view.
     */
    handleClientConnection: function(client) {
        this.dispatch({
            source: 'CLIENT_CONNECTION',
            client: client
        });
    },

    registerClientConnections: function(cb) {
        return this.register(function(payload) {
            if (payload.source === 'CLIENT_CONNECTION') {
                return cb(payload);
            }

            return true;
        });
    },
});

module.exports = MinodeServerDispatcher;
