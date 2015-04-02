let React = require('react');
let mainStore = require('../mainStore');
//let ServerPickerActions = require('./ServerPickerActions');

let ServerPicker = React.createClass({

    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
        return {
            servers: []
        };
    },

    componentDidMount: function () {
        mainStore.addServersInfoListener(this.onServersInfo);
    },

    componentWillUnmount: function () {
        mainStore.removeServersInfoListener(this.onServersInfo);
    },

    render: function () {
        let servers = this.state.servers.map(server => {
            return (<option key={server.name} value={server.name}>{server.name}</option>);
        });

        return (
            <select placeholder='Pick server' onChange={this.onChange} value={this.state.currentServerName}>
                {servers}
            </select>
        );
    },

    onServersInfo: function () {
        let currentServer = this.context.router.getCurrentParams().serverName;

        if (!currentServer && mainStore.servers.length) {
            currentServer = mainStore.servers[0].name;
            this.context.router.transitionTo('dashboard', {serverName: currentServer});
        }

        this.setState({
            servers: mainStore.servers,
            currentServerName: currentServer
        });
    },

    onChange: function (e) {
        let serverName = e.target.value;

        if (serverName && mainStore.pickServer(serverName)) {
            this.context.router.transitionTo('dashboard', {serverName: serverName});
            this.setState({
                currentServerName: serverName
            });
        }
    },
});

module.exports = ServerPicker;
