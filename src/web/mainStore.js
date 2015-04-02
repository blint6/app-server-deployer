let EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');
let dispatcher = require('./dispatcher');
let mainConstants = require('../common/mainConstants');

let SERVERS_INFO_EVENT = 'serversInfo';
let PICK_SERVER_EVENT = 'pickServer';

let ServerPickerStore = assign({}, EventEmitter.prototype, {

    pickServer: function(serverName) {
        if (this.serverByName[serverName]) {
            this.currentServer = this.serverByName[serverName];
            //window.location.hash = '#server/' + serverName + '/dashboard';
            this.emitPickServer();
            return true;
        }
    },

    emitServersInfo: function() {
        this.emit(SERVERS_INFO_EVENT);
    },

    addServersInfoListener: function(callback) {
        this.on(SERVERS_INFO_EVENT, callback);
    },

    removeServersInfoListener: function(callback) {
        this.removeListener(SERVERS_INFO_EVENT, callback);
    },

    emitPickServer: function() {
        this.emit(PICK_SERVER_EVENT);
    },

    addPickServerListener: function(callback) {
        this.on(PICK_SERVER_EVENT, callback);
    },

    removePickServerListener: function(callback) {
        this.removeListener(PICK_SERVER_EVENT, callback);
    },

    dispatcherIndex: dispatcher.register(function(payload) {
        let action = payload.action;

        if (payload.source === 'SERVER_ACTION') {
            switch (action.actionType) {

                case mainConstants.SERVERS_INFO:
                    ServerPickerStore.servers = action.servers;
                    ServerPickerStore.serverByName = {};

                    action.servers.forEach(server => {
                        ServerPickerStore.serverByName[server.name] = server;
                    });

                    ServerPickerStore.emitServersInfo();

                    if (action.servers.length) {
                        ServerPickerStore.pickServer(action.servers[0].name);
                    }
                    break;
            }

            return true;
        }
    })
});

module.exports = ServerPickerStore;
