let React = require('react');
let Nav = require('react-bootstrap/lib/Nav');
let NavItemLink = require('react-router-bootstrap/lib/NavItemLink');

module.exports = React.createClass({
    render: function() {
        return (<Nav bsStyle="pills" stacked>
        	<NavItemLink to="chat">Chat</NavItemLink>
    	</Nav>);
    }
});
