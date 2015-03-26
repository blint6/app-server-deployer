let React = require('react');
let ServerPicker = require('../ServerPicker/ServerPicker');

module.exports = React.createClass({
    render: function() {
        return (
			<header>
		    	<h1>Minode</h1>
		    	<ServerPicker />
			</header>
    	);
    }
});
