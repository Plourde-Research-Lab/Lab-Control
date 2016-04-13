var mongoose = require('mongoose');

// var liqADDR = 'mongodb://prl-redmine.syr.edu';
var liqADDR = 'mongodb://localhost';

var liqConnections = {
	dataDB: mongoose.createConnection(liqADDR + '/data')
};

module.exports = liqConnections;