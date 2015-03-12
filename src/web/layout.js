let React = require('react');
let Grid = require('react-bootstrap/lib/Grid');
let Row = require('react-bootstrap/lib/Row');
let Col = require('react-bootstrap/lib/Col');
let RouteHandler = require('react-router').RouteHandler;

let Banner = require('./banner/banner');
let Menu = require('./menu/menu');

module.exports = React.createClass({
    render: function() {
        return (<Grid>
		<Row>
			<Col md={3}><Banner/></Col>
		</Row>
		<Row>
			<Col md={3}><Menu/></Col>
			<Col md={9}><RouteHandler/></Col>
		</Row>
	</Grid>);
    }
});
