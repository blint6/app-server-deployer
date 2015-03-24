let Promise = require('es6-promise').Promise;
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let BukkitServerSchema = new Schema({
    appServer: Schema.Types.ObjectId,
    jar: String,
});

BukkitServerSchema.statics.findServer = function(appServerDef) {
    return new Promise((resolve, reject) =>
        this.model('BukkitServer').findOne({
            appServer: appServerDef._id
        }, function(err, bukkitServer) {
            if (err) reject(err);
            else resolve(bukkitServer);
        }));
};

module.exports = mongoose.model('BukkitServer', BukkitServerSchema);
