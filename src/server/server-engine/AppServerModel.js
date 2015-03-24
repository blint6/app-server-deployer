let Promise = require('es6-promise').Promise;
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AppServerSchema = new Schema({
    name: String,
    port: Number,
    memory: Number,
    engine: String,
});

AppServerSchema.statics.findServers = function() {
    return new Promise((resolve, reject) =>
        this.model('AppServer').find({}, function(err, servers) {
            if (err) reject(err);
            else resolve(servers);
        }));
};

module.exports = mongoose.model('AppServer', AppServerSchema);
