let dispatcher = require('./dispatcher');
let mainConstants = require('../common/mainConstants');
let TestServer = require('./server-engine/test/TestServer');

console.info('Minode demo start');

require('./serve');

let demoServer = TestServer.load();

let server = new TestServer();

dispatcher.registerClientConnections(function (payload) {
    dispatcher.handleServiceAction({
        actionType: mainConstants.SERVERS_INFO,
        servers: [{
            name: server.getName()
        }]
    }, payload.client);
});

demoServer.run();
