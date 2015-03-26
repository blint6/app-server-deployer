let React = require('react');
let Nav = require('react-bootstrap/lib/Nav');
let NavItemLink = require('react-router-bootstrap/lib/NavItemLink');
let minodeModules = require('./modules');
let mainStore = require('./mainStore');

module.exports = React.createClass({

    contextTypes: {
        router: React.PropTypes.func
    },

    render: function() {
        let serverName = this.context.router.getParams().serverName;

		let menuElements = minodeModules.map((mod, i) => (
        	<NavItemLink key={i} to={mod.uri} params={{ serverName: serverName }}>
        		<span className={mod.menuClassName} />
        		&nbsp;&nbsp;
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
