let React = require('react');
let Input = require('react-bootstrap/lib/Input');
let ConsoleStore = require('./ConsoleStore');
let ConsoleActions = require('./ConsoleActionsWeb');

let style = {};

style.header = {
	height: 50,
	margin: 10,
};

style.consoleWrapper = {
	height: '100%',
	marginTop: -70,
	paddingTop: 70,
	marginBottom: -36,
	paddingBottom: 36,
};

style.console = {
	background: '#272822',
	color: '#eeeeee',
	fontFamily: 'Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace',
	padding: '10 1em',
	margin: '0',
	height: '100%',
	overflow: 'auto',
};

style.line = {
	listStyleType: 'none',
};

style.input = {
	display: 'block',
	height: 36,
};

let header = (<h2 style={style.header}>Console</h2>);
let input = (<Input type="text" placeholder="Enter command" style={style.input} />);

let Console = React.createClass({

	getInitialState: function() {
		return {
			lines: ConsoleStore.getMessages()
		};
	},

	componentDidMount: function() {
		ConsoleActions.subscribe('testBukkit');
		ConsoleStore.addChangeListener(this._onNewMessages);
	},

	componentWillUnmount: function() {
		ConsoleActions.unsubscribe('testBukkit');
		ConsoleStore.removeChangeListener(this._onNewMessages);
	},

    render: function() {
    	let lines = this.state.lines.map(line => {
    		return (<li key={line.id} style={style.line}>{line.content}</li>);
    	});

        return (
        	<div className="h100">
	        	{header}
	        	<div style={style.consoleWrapper}>
	        		<ul style={style.console}>
	        			{lines}
	        		</ul>
	        	</div>
	        	{input}
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