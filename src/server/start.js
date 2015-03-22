let path = require('path');
let express = require('express');
let morgan = require('morgan');
let consolidate = require('consolidate');
let dbConnect = require('./db/connect');
let BukkitServer = require('./server-engine/bukkit/BukkitServer');
let ClientIo = require('./io/ClientIo');

console.info('Minode start');

let app = express();

let status404 = function(req, res) {
	res.status(404).end();
};

//dbConnect('mongodb://localhost/minode');

// Only use logger for development environment
if (true || process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.engine('jade', consolidate.jade);
app.set('view engine', 'html');
app.enable('jsonp callback');

app.use('/vendor', express.static(process.cwd() + '/bower_components'));

app.use('/script/minode.js', express.static(require.resolve('minode/web/minode.js')));
app.use('/script/minode.js.map', express.static(require.resolve('minode/web/minode.js.map')));
app.use('/script', status404);

app.use('/style/layout.css', express.static(require.resolve('minode/web/layout.css')));
app.use('/style', status404);

let indexPath = require.resolve('minode/web/index.jade');
app.use('/', function(req, res) {
    res.render(indexPath);
});

let server = app.listen(3000),
    io = ClientIo(server);

let testServer = BukkitServer.install('testBukkit');
testServer.run();

module.exports.stop = function() {
    console.info('Minode stop');
    return new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
};
