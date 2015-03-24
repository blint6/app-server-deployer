let express = require('express');
let morgan = require('morgan');
let consolidate = require('consolidate');
let clientIo = require('./io/clientIo');

let app = express();

let status404 = function(req, res) {
    res.status(404).end();
};

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

let server = app.listen(3000);
clientIo(server);
