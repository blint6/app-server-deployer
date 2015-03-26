require('./io/ServerIo');

let React = require('react');
let Router = require('react-router');
let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;
let Redirect = Router.Redirect;
let Layout = require('./layout');
let LayoutContentDefault = require('./layoutContentDefault');
let LayoutContentServer = require('./layoutContentServer');
let minodeModules = require('./modules');

let routeElements = minodeModules.map((mod, i) => (
	<Route key={i} name={mod.name} handler={mod.handler} />
));

let routes = (
	<Route handler={Layout} path="/">
		<DefaultRoute handler={LayoutContentDefault} />
		<Route handler={LayoutContentServer} path="server/:serverName">
			{routeElements}
		</Route>
	</Route>
);

Router.run(routes, function(Handler) {
    React.render(<Handler/>, document.body);
});
