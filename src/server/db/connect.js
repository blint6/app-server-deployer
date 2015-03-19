let Promise = require('es6-promise').Promise;
let mongoose = require('mongoose');

module.exports = function connect(connectionString) {
    return new Promise(function(resolve, reject) {
        let db = mongoose.connect(connectionString);
        let resolved = false;

        db.once('open', function() {
            resolved = true;
            resolve(db);
        });
        db.on('error', function(err) {
            console.error('Connection error:', err);

            if (!resolved)
                reject(err);
        });
    });
};
