let path = require('path');
let AppServer = require('../AppServer');
let extend = require('extend');

class BukkitServer extends AppServer {

    constructor(serverData) {
        extend(this, serverData);
    }

    getLogFile() {
        return path.resolve(this.path, 'server.log');
    }

    handleOutData(data) {
        console.debug('Bukkit Server:', data);
    }

    handleOutError(data) {
        console.error('Bukkit Server error:', data);
    }

    spawnServer() {
        let args = [];
        args.push(`-Xmx${this.memory}M`);
        args.push(`-Xrunjdwp:transport=dt_socket,address=${this.port},server=y,suspend=n`);
        args.push('-jar');
        args.push(this.jar);

        return spawn('java', args, {
            cwd: this.path
        });
    }
}

BukkitServer.install = function install(path) {
    return new BukkitServer({
        path: path,
        jar: '',
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