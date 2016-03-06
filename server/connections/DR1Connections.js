var mongoose = require('mongoose');

var DR1ADDR = 'mongodb://128.230.52.239';

var DR1Connections = {
	dataDB: mongoose.createConnection(DR1ADDR + '/data'),
	historyDB: mongoose.createConnection(DR1ADDR + '/history')
};

module.exports = DR1Connections;