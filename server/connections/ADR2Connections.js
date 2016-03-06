var mongoose = require('mongoose');

// var ADR2ADDR = 'mongodb://localhost';
var ADR2ADDR = 'mongodb://128.230.52.239'

var ADR2Connections = {
	dataDB: mongoose.createConnection(ADR2ADDR + '/data'),
	historyDB: mongoose.createConnection(ADR2ADDR + '/history'),
	controlDB: mongoose.createConnection(ADR2ADDR + '/control'),
	jobDB: mongoose.createConnection(ADR2ADDR + '/jobs')
};

module.exports = ADR2Connections;