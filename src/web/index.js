require('./io/ServerIo');

let React = require('react');
let Router = require('react-router');
let Layout = require('./layout');
let Console = require('./console/Console');
let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;
let NotFoundRoute = Router.NotFoundRoute;

let routes = <Route handler={Layout} path="/">
    	<DefaultRoute handler={Console}/>
    	<Route name="chat" handler={Console}/>
	</Route>;

Router.run(routes, function(Handler) {
    React.render(<Handler/>, document.body);
});
