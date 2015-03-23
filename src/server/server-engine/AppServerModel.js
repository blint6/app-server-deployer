let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let BukkitServerSchema = new Schema({
    name: String,
    port: Number,
    memory: Number,
    engine: Schema.Types.ObjectId,
});

mongoose.model('AppServer', BukkitServerSchema);
module.exports = mongoose.model('AppServer');
