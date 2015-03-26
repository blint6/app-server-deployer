let React = require('react');
let Input = require('react-bootstrap/lib/Input');
let ConsoleStore = require('./ConsoleStore');
let ConsoleActions = require('./ConsoleActionsWeb');

let style = {};

style.consoleWrapper = {
	height: '100%',
	marginBottom: -36,
	paddingBottom: 36,
};

style.console = {
	background: '#272822',
	color: '#eeeeee',
	fontFamily: 'Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace',
	padding: '8 1em 4 1em',
	margin: '0',
	height: '100%',
	overflow: 'auto',
};

style.line = {
	listStyleType: 'none',
	lineHeight: '1.12em',
};

style.input = {
	display: 'block',
	height: 36,
};

let Console = React.createClass({

	getDefaultProps: function() {
		return {
			serverId: 'testBukkit'
		};
	},

	getInitialState: function() {
		return {
			lines: ConsoleStore.getMessages()
		};
	},

	componentDidMount: function() {
		ConsoleActions.subscribe(this.props.serverId);
		ConsoleStore.addChangeListener(this._onNewMessages);
	},

	componentWillUnmount: function() {
		ConsoleActions.unsubscribe(this.props.serverId);
		ConsoleStore.removeChangeListener(this._onNewMessages);
	},

    componentWillUpdate: function() {
    	let consoleDom = this.refs.console.getDOMNode();
    	this._needsScrollDown = consoleDom.scrollHeight === (consoleDom.scrollTop + consoleDom.offsetHeight);
    },

    render: function() {
    	let lines = this.state.lines.map(line => {
    		return (<li key={line.id} style={style.line}>{line.content}</li>);
    	});

        return (
        	<div className="h100">
	        	<div style={style.consoleWrapper}>
	        		<ul style={style.console} ref="console">
	        			{lines}
	        		</ul>
	        	</div>
        		<Input type="text" placeholder="Enter command" style={style.input} onKeyDown={this._onKeyDown} />
	        </div>
        );
    },

    componentDidUpdate: function() {
		let consoleDom = this.refs.console.getDOMNode();	

    	if (this._needsScrollDown || !this._autoscrolled && consoleDom.scrollHeight > consoleDom.offsetHeight) {
    		consoleDom.scrollTop = consoleDom.scrollHeight;
    		this._autoscrolled = true;
       	}
    },

    _onNewMessages: function(messages) {
		this.setState({
			lines: ConsoleStore.getMessages()
		});
    },

    _onKeyDown: function(e) {
		if (event.keyCode === 13) { // Enter Pressed
			ConsoleActions.sendMessage(this.props.serverId, e.target.value);
			e.target.value = '';
		}
    },
});

module.exports = Console;