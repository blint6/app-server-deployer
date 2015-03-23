let React = require('react');
let Nav = require('react-bootstrap/lib/Nav');
let NavItemLink = require('react-router-bootstrap/lib/NavItemLink');
let minodeModules = require('./modules');

module.exports = React.createClass({
    render: function() {

		let menuElements = minodeModules.map((mod, i) => (
        	<NavItemLink key={i} to={mod.uri}>
        		<span className={mod.menuClassName} />
        		&nbsp;
        		{mod.menuName}
        	</NavItemLink>
		));

        return (
        	<Nav bsStyle="pills" stacked>
	        	{menuElements}
	    	</Nav>
	    );
    }
});
