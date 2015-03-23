let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let BukkitServerSchema = new Schema({
    jar: String,
});

mongoose.model('BukkitServer', BukkitServerSchema);
module.exports = mongoose.model('BukkitServer');
