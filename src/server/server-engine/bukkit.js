let EventEmitter = require('event').EventEmitter;
let path = require('path');
let extend = require('extend');

class BukkitServer extends EventEmitter {
    constructor(serverData) {
        extend(this, serverData);
    }

    getLogFile() {
        return path.resolve(this.path, 'server.log');
    }
}

module.exports.install = function install(path) {
    return new BukkitServer({
        path: path
    });
};

module.exports.resolve = function resolve(serverData) {
    return new BukkitServer(serverData);
};
