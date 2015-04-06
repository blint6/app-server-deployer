let log = require('./core/logger');
let dispatcher = require('./core/dispatcher');
let mainConstants = require('../common/mainConstants');
let TestServer = require('./server-engine/test/TestServer');

log.info('Minode demo start');

require('./serve');

let servers = [
    TestServer.load('foo-server', {sendInterval: 4000}),
    TestServer.load('bar-server', {sendInterval: 5000})
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
