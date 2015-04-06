let React = require('react');
let Input = require('react-bootstrap/lib/Input');

let mainStore = require('../../web/mainStore');
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

    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
        return {
            lines: ConsoleStore.getMessages()
        };
    },

    componentDidMount: function () {
        ConsoleActions.subscribe(this.context.router.getCurrentParams().serverName);
        ConsoleStore.addChangeListener(this.onNewMessages);
    },

    componentWillUnmount: function () {
        ConsoleActions.unsubscribe(this.context.router.getCurrentParams().serverName);
        ConsoleStore.removeChangeListener(this.onNewMessages);
    },

    componentWillUpdate: function () {
        let consoleDom = this.refs.console.getDOMNode();
        this.needsScrollDown = consoleDom.scrollHeight === (consoleDom.scrollTop + consoleDom.offsetHeight);
    },

    render: function () {
        let lines = this.state.lines.map(line => {
            return (
                <li key={line.id} style={style.line}>{line.message}</li>
            );
        });

        return (
            <div className="h100">
                <div style={style.consoleWrapper}>
                    <ul style={style.console} ref="console">
                        {lines}
                    </ul>
                </div>
                <Input type="text" placeholder="Enter command" style={style.input} onKeyDown={this.onKeyDown}/>
            </div>
        );
    },

    componentDidUpdate: function () {
        let consoleDom = this.refs.console.getDOMNode();

        if (this.needsScrollDown || !this.autoscrolled && consoleDom.scrollHeight > consoleDom.offsetHeight) {
            consoleDom.scrollTop = consoleDom.scrollHeight;
            this.autoscrolled = true;
        }
    },

    onNewMessages: function () {
        this.setState({
            lines: ConsoleStore.getMessages()
        });
    },

    onKeyDown: function (e) {
        if (event.keyCode === 13) { // Enter Pressed
            ConsoleActions.sendMessage(this.props.serverId, e.target.value);
            e.target.value = '';
        }
    },
});

module.exports = Console;
