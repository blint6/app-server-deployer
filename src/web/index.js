require('./io/ServerIo');

let React = require('react');
let Router = require('react-router');
let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;
let Redirect = Router.Redirect;
let Layout = require('./layout');
let minodeModules = require('./modules');

let routeElements = minodeModules.map((mod, i) => (
	<Route key={i} name={mod.name} handler={mod.handler} />
));

let routes = (
	<Route handler={Layout} path="/">
		{routeElements}
	</Route>
);

Router.run(routes, function(Handler) {
    React.render(<Handler/>, document.body);
});
