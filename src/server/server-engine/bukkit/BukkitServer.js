let path = require('path');
let spawn = require('child_process').spawn;
let extend = require('extend');
let AppServer = require('../AppServer');

class BukkitServer extends AppServer {

    constructor(serverData) {
        extend(this, serverData);
    }

    getLogFile() {
        return path.resolve(this.path, 'server.log');
    }

    spawnServer() {
        let args = [];
        args.push(`-Xmx${this.memory}M`);
        args.push(`-Xrunjdwp:transport=dt_socket,address=${this.port},server=y,suspend=n`);
        args.push('-jar');
        args.push(this.jar);

        console.info('Executing server with command: java', args.join(' '));
        return spawn('java', args, {
            cwd: this.getExecutionDir(),
            stdio: this.stdio
        });
    }
}

BukkitServer.install = function install(path) {
    return new BukkitServer({
        path: path,
        jar: 'D:\\Apps\\SpigotBuild\\spigot-1.8.jar',
        port: 8000,
        memory: 1024
    });
};

BukkitServer.load = function load(serverData) {
    let server = new BukkitServer(serverData);
    // TODO consistency checks
    return server;
};

module.exports = BukkitServer;