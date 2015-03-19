let Dispatcher = require('./Dispatcher');
let assign = require('object-assign');

let MinodeDispatcher = assign({}, Dispatcher.prototype, {

    /**
     * A bridge function between the views and the dispatcher, marking the action
     * as a view action.  Another variant here could be handleServerAction.
     * @param  {object} action The data coming from the view.
     */
    handleViewAction: function(action, sendToServer) {
        this.dispatch({
            source: 'VIEW_ACTION',
            sendToServer: sendToServer,
            action: action
        });
    },

    /**
     * A bridge function between the server and the dispatcher.
     * @param  {object} action The data coming from the view.
     */
    handleServerAction: function(action) {
        this.dispatch({
            source: 'SERVER_ACTION',
            action: action
        });
    },
});

module.exports = MinodeDispatcher;
