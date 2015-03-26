let React = require('react');
let Row = require('react-bootstrap/lib/Row');
let Col = require('react-bootstrap/lib/Col');
let RouteHandler = require('react-router').RouteHandler;

let Menu = require('./menu');

module.exports = React.createClass({
    render: function() {
        return (
			<Row id="contentRow">
				<Col md={12} id="contentCell">
					<h1>Welcome</h1>
				</Col>
			</Row>
		);
    }
});
