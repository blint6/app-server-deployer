let dispatcher = require('./core/dispatcher');
let mainConstants = require('../common/mainConstants');
let TestServer = require('./server-engine/test/TestServer');

console.info('Minode demo start');

require('./serve');

let servers = [
    TestServer.load('foo-server'),
    TestServer.load('bar-server')
];

dispatcher.registerClientConnections(function (payload) {
    dispatcher.handleServiceAction({
        actionType: mainConstants.SERVERS_INFO,
        servers: servers.map(server => ({
            name: server.getName()
        }))
    }, payload.client);
});

servers.forEach(server => server.run());
