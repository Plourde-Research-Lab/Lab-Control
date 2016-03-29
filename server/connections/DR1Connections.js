var mongoose = require('mongoose');

// var DR1ADDR = 'mongodb://128.230.72.235';
var DR1ADDR = 'mongodb://localhost'

var DR1Connections = {
	dataDB: mongoose.createConnection(DR1ADDR + '/data'),
	historyDB: mongoose.createConnection(DR1ADDR + '/history')
};

module.exports = DR1Connections;