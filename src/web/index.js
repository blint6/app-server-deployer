let React = require('react');
let Router = require('react-router');
let Layout = require('./layout');
let Chat = require('./chat/chat');
let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;
let NotFoundRoute = Router.NotFoundRoute;

let routes = <Route handler={Layout} path="/">
    	<DefaultRoute handler={Chat}/>
    	<Route name="chat" handler={Chat}/>
	</Route>;

Router.run(routes, function(Handler) {
    React.render(<Handler/>, document.body);
});
