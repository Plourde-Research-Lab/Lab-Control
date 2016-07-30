var mongoose = require('mongoose');

var DR1ADDR = 'mongodb://prl-redmine.syr.edu';
// var DR1ADDR = 'mongodb://localhost';

var DR1Connections = {
	dataDB: mongoose.createConnection(DR1ADDR + '/data'),
	historyDB: mongoose.createConnection(DR1ADDR + '/history'),
	controlDB: mongoose.createConnection(DR1ADDR + '/control')

};

module.exports = DR1Connections;