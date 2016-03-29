var mongoose = require('mongoose');

var ADR2ADDR = 'mongodb://prl-redmine.syr.edu';

var ADR2Connections = {
	dataDB: mongoose.createConnection(ADR2ADDR + '/data'),
	historyDB: mongoose.createConnection(ADR2ADDR + '/history'),
	controlDB: mongoose.createConnection(ADR2ADDR + '/control'),
	jobDB: mongoose.createConnection(ADR2ADDR + '/jobs')
};

module.exports = ADR2Connections;