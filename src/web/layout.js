let React = require('react');
let Grid = require('react-bootstrap/lib/Grid');
let Row = require('react-bootstrap/lib/Row');
let Col = require('react-bootstrap/lib/Col');
let RouteHandler = require('react-router').RouteHandler;

let Banner = require('./banner/banner');
let Menu = require('./menu');

module.exports = React.createClass({

    render: function () {
        return (
            <Grid fluid>
                <Row id="headerRow">
                    <Col md={12}><Banner/></Col>
                </Row>
                <RouteHandler/>
            </Grid>
        );
    }
});
