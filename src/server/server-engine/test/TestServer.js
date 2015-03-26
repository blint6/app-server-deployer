let path = require('path');
let spawn = require('child_process').spawn;
let AppServer = require('../AppServer');

class TestServer extends AppServer {

    constructor() {
        super({
            name: 'test-instance',
            engine: 'test',
            port: 0,
            memory: 1024
        });
    }

    getLogFile() {
        return path.resolve(this.path, 'test-server.log');
    }

    spawnServer() {
        let args = [require.resolve('./TestServerProcess')];

        console.info('Executing test server with command: node', args.join(' '));
        return spawn('node', args, {
            cwd: this.getExecutionDir(),
            stdio: this.stdio
        });
    }
}

TestServer.load = function load() {
    return new TestServer();
};

module.exports = TestServer;
