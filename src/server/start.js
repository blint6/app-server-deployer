let AppServer = require('./server-engine/AppServer');
let dbConnect = require('./db/connect');


console.info('Minode start');

require('./serve');

dbConnect('mongodb://localhost/minode')

.then(() => AppServer.loadAll())

//.then(() => AppServer.install('bukkit', 'testBukkit'), err => console.error(err.stack || err))

.then(null, err => console.error(err.stack || err));
