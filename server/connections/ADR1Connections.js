var mongoose = require('mongoose');

var ADR1ADDR = 'mongodb://localhost';

var ADR1Connections = {
	dataDB: mongoose.createConnection(ADR1ADDR + '/data'),
	historyDB: mongoose.createConnection(ADR1ADDR + '/history'),
	controlDB: mongoose.createConnection(ADR1ADDR + '/control'),
	jobDB: mongoose.createConnection(ADR1ADDR + '/jobs')
};

module.exports = ADR1Connections;