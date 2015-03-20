let io = require('socket.io-client');
let server = io('http://localhost:3000/');
let MinodeDispatcher = require('../dispatcher');

server.on('dispatch', MinodeDispatcher.handleServerAction.bind(MinodeDispatcher));

MinodeDispatcher.register(function(payload) {
    if (payload.sendToServer) {
        server.emit('message', payload.action);
    }

    return true;
});
