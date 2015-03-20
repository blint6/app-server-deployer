let React = require('react');
let ConsoleStore = require('../store/ConsoleStore');
let ConsoleActions = require('../action/ConsoleActions');

let Console = React.createClass({

	getInitialState: function() {
		return {
			lines: ConsoleStore.getMessages()
		};
	},

	componentDidMount: function() {
		ConsoleStore.addChangeListener(this._onNewMessages);
	},

	componentWillUnmount: function() {
		ConsoleStore.removeChangeListener(this._onNewMessages);
	},

    render: function() {
    	let lines = this.state.lines.map(line => {
    		return (<li key={line.id}>{line.content}</li>);
    	});

        return (
        	<div>
	        	<h2>Chat here yo</h2>
	        	<ul>{lines}</ul>
	        </div>
        );
    },

    _onNewMessages: function(messages) {
		this.setState({
			lines: ConsoleStore.getMessages()
		});
    },
});

module.exports = Console;