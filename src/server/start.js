let log = require('./core/logger');
let AppServer = require('./server-engine/AppServer');
let dbConnect = require('./db/connect');


log.info('Minode start');

require('./serve');

dbConnect('mongodb://localhost/minode')

.then(() => AppServer.loadAll())

//.then(() => AppServer.install('bukkit', 'testBukkit'), err => console.error(err.stack || err))

.then(null, err => log.error(err));
