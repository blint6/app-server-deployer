let React = require('react');
let Row = require('react-bootstrap/lib/Row');
let Col = require('react-bootstrap/lib/Col');
let RouteHandler = require('react-router').RouteHandler;

let Menu = require('./menu');

module.exports = React.createClass({

    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    render: function () {
        let context = {
            serverName: this.context.router.getCurrentParams().serverName
        };
        return (
            <Row id="contentRow">
                <Col md={3} lg={2} className="well">
                    <Menu/>
                </Col>
                <Col md={9} lg={10} id="contentCell">
                    <RouteHandler params={context}/>
                </Col>
            </Row>
        );
    }
});
