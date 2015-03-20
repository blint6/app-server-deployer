let path = require('path');
let socketio = require('socket.io');
let express = require('express');
let morgan = require('morgan');
let consolidate = require('consolidate');
let dbConnect = require('./db/connect');
let BukkitServer = require('./server-engine/bukkit/BukkitServer');
let Tail = require('tail').Tail;

console.info('Minode start');

let app = express();

//dbConnect('mongodb://localhost/minode');

// Only use logger for development environment
if (true || process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.engine('jade', consolidate.jade);
app.set('view engine', 'html');
app.enable('jsonp callback');

app.use('/vendor', express.static(process.cwd() + '/bower_components'));
app.use('/script/minode.js', express.static(process.cwd() + '/build/web/minode.js'));

let indexPath = path.resolve(__dirname, '../web/index.jade');
app.use('/', function(req, res) {
    res.render(indexPath);
});


let testServer = BukkitServer.install('testBukkit');
testServer.run();


// Realtime IO
let server = app.listen(3000),
    io = socketio.listen(server);

io.on('connection', socket => {
    console.info('Got a handshake');

    let tail = new Tail(testServer.getLog()),
        i = 0;
    tail.on('line', function(data) {
        socket.emit('dispatch', {
            actionType: 'Console.NEW_MESSAGES',
            messages: [{
                id: i,
                content: data
            }]
        });
        i += 1;
    });
});


module.exports.stop = function() {
    console.info('Minode stop');
    return new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
};
