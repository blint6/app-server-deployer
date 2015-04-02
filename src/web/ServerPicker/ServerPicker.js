let React = require('react');
let mainStore = require('../mainStore');
//let ServerPickerActions = require('./ServerPickerActions');

let ServerPicker = React.createClass({

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
            <select placeholder='Pick server' onChange={this.onChange}>
                {servers}
            </select>
        );
    },

    onServersInfo: function () {
        this.setState({
            servers: mainStore.servers
        });
    },

    onChange: function (e) {
        let serverName = e.target.value;

        if (serverName)
            mainStore.pickServer(serverName);
    },
});

module.exports = ServerPicker;
