let Dispatcher = require('../../../common/dispatcher/Dispatcher');
let assign = require('object-assign');

let MinodeServerDispatcher = assign({}, Dispatcher.prototype, {

    /**
     * A bridge function between the services and the dispatcher, marking the action
     * as a view action.  Another variant here could be handleServerAction.
     * @param  {object} action The data coming from the view.
     * @param  {boolean} client The client to send the payload to, if necessary.
     */
    handleServiceAction: function (action, client) {
        if (!action) throw Error('No action provided');

        return this.dispatch({
            source: 'SERVICE_ACTION',
            client: client,
            action: action
        });
    },

    registerServiceActions: function (cb) {
        return this.register(function (payload) {
            if (payload.source === 'SERVICE_ACTION') {
                return cb(payload, payload.action);
            }

            return true;
        });
    },

    /**
     * A bridge function between the client and the dispatcher.
     * @param  {boolean} client The client that sent the payload.
     * @param  {object} action The data coming from the view.
     */
    handleClientAction: function (client, action) {
        if (!action) throw Error('No action provided');

        return this.dispatch({
            source: 'CLIENT_ACTION',
            client: client,
            action: action
        });
    },

    registerClientActions: function (cb) {
        return this.register(function (payload) {
            if (payload.source === 'CLIENT_ACTION') {
                return cb(payload, payload.action);
            }

            return true;
        });
    },

    /**
     * Handler for client connections.
     * @param  {boolean} client The client that connected.
     */
    handleClientConnection: function (client) {
        return this.dispatch({
            source: 'CLIENT_CONNECTION',
            client: client
        });
    },

    registerClientConnections: function (cb) {
        return this.register(function (payload) {
            if (payload.source === 'CLIENT_CONNECTION') {
                return cb(payload);
            }

            return true;
        });
    },
});

module.exports = MinodeServerDispatcher;
