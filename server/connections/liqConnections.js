var mongoose = require('mongoose');

var liqADDR = 'mongodb://localhost';

var liqConnections = {
	dataDB: mongoose.createConnection(liqADDR + '/data')
};

module.exports = liqConnections;