let React = require('react');
let ChatStore = require('../store/ChatStore');
let ChatActions = require('../action/ChatActions');

let Chat = React.createClass({

	getInitialState: function() {
		return {
			lines: ChatStore.getMessages()
		};
	},

	componentDidMount: function() {
		ChatStore.addChangeListener(this._onNewMessages);
	},

	componentWillUnmount: function() {
		ChatStore.removeChangeListener(this._onNewMessages);
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
			lines: ChatStore.getMessages()
		});
    },
});

module.exports = Chat;