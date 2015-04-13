let log = require('./core/logger');
let dispatcher = require('./core/dispatcher');
let mainConstants = require('../common/mainConstants');
let TestServer = require('./server-engine/test/TestServer');

log.info('Minode demo start');

require('./serve');

let actions = [
    require('../component/console/ConsoleActionsSrv')
];

let servers = [
    TestServer.load({name: 'foo-server'}, {sendInterval: 4000}),
    TestServer.load({name: 'bar-server'}, {sendInterval: 5000})
];

dispatcher.registerClientConnections(function (payload) {
    dispatcher.handleServiceAction({
        actionType: mainConstants.SERVERS_INFO,
        servers: servers.map(server => ({
            name: server.getName()
        }))
    }, payload.client);
});

actions.forEach(action => action.register());
servers.forEach(server => server.run());
