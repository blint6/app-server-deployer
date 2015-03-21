let io = require('socket.io-client');
let server = io('http://localhost:3000/');
let dispatcher = require('../dispatcher');

server.on('dispatch', dispatcher.handleServerAction.bind(dispatcher));

dispatcher.register(function(payload) {
    if (payload.sendToServer) {
        server.emit('message', payload.action);
    }

    return true;
});
