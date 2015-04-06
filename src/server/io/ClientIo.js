let socketio = require('socket.io');
let log = require('../core/logger');
let dispatcher = require('../core/dispatcher');

module.exports = function (server) {

    let io = socketio.listen(server);

    io.on('connection', function (client) {
        log.debug('Got a handshake');
        dispatcher.handleClientConnection(client);

        client.on('message', dispatcher.handleClientAction.bind(dispatcher, client));
    });

    dispatcher.registerServiceActions(function (p) {

        if (p.client) {
            let clients = p.client;

            if (!Array.isArray(clients))
                clients = [clients];

            clients.forEach(client => client.emit('dispatch', p.action));
        }

        return true;
    });

    return io;
};
