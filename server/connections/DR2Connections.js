var mongoose = require('mongoose');

var DR2ADDR = 'mongodb://prl-redmine.syr.edu';

var DR2Connections = {
	dataDB: mongoose.createConnection(DR2ADDR + '/data'),
	historyDB: mongoose.createConnection(DR2ADDR + '/history')
};

module.exports = DR2Connections;
