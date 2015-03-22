let React = require('react');
let Grid = require('react-bootstrap/lib/Grid');
let Row = require('react-bootstrap/lib/Row');
let Col = require('react-bootstrap/lib/Col');
let RouteHandler = require('react-router').RouteHandler;

let Banner = require('./banner/banner');
let Menu = require('./menu/menu');

module.exports = React.createClass({
    render: function() {
        return (<Grid fluid>
		<Row className="headerRow">
			<Col md={12}><Banner/></Col>
		</Row>
		<Row className="contentRow">
			<Col md={3} lg={2} styleClass="no-float"><Menu/></Col>
			<Col md={9} lg={10} styleClass="no-float"><RouteHandler/></Col>
		</Row>
	</Grid>);
    }
});
