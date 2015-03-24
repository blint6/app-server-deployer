let path = require('path');
let spawn = require('child_process').spawn;
let Promise = require('es6-promise').Promise;
let AppServer = require('../AppServer');
let BukkitServerModel = require('./BukkitServerModel');

class BukkitServer extends AppServer {

    constructor(appServerDef, bukkitDef) {
        super(appServerDef);
        this._bukkitDef = bukkitDef;
    }

    getLogFile() {
        return path.resolve(this.path, 'server.log');
    }

    spawnServer() {
        let args = [];
        args.push(`-Xmx${this._appServerDef.memory}M`);
        args.push(`-Xrunjdwp:transport=dt_socket,address=${this._appServerDef.port},server=y,suspend=n`);
        args.push('-jar');
        args.push(this._bukkitDef.jar);

        console.info('Executing server with command: java', args.join(' '));
        return spawn('java', args, {
            cwd: this.getExecutionDir(),
            stdio: this.stdio
        });
    }
}

BukkitServer.install = function install(appServerDef, options) {
    console.log('Installing new bukkit server', appServerDef.name);
    let bukkitDef = new BukkitServerModel({
        appServer: appServerDef,
        jar: 'D:\\Apps\\SpigotBuild\\spigot-1.8.jar',
    });

    return new Promise((resolve, reject) => {
            bukkitDef.save(err => {
                if (err) reject(Error(`Could not save new bukkit server ${appServerDef.name} to DB`, err));
                else resolve();
            });
        })
        .then(() => new BukkitServer(appServerDef, bukkitDef));
};

BukkitServer.load = function load(appServerDef) {
    return BukkitServerModel.findServer(appServerDef)
        .then(bukkitDef => {
            let server = new BukkitServer(appServerDef, bukkitDef);
            // TODO consistency checks
            return server;
        });
};

module.exports = BukkitServer;
