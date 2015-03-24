let Promise = require('es6-promise').Promise;
let mongoose = require('mongoose');

module.exports = function connect(connectionString) {
    return new Promise(function(resolve, reject) {
        mongoose.connect(connectionString);
        let resolved = false;

        mongoose.connection.once('open', function() {
            resolved = true;
            resolve(mongoose.connection);
        });
        mongoose.connection.on('error', function(err) {
            console.error('Connection error:', err);

            if (!resolved)
                reject(err);
        });
    });
};
