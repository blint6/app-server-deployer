let mongoose = require('mongoose');

module.exports = function define(modelName, definiton) {
	return mongoose.model(modelName, definiton);
};