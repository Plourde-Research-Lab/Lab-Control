var DRDataSchema = require('../schemas/DRDataSchema');
var DRHistorySchema = require('../schemas/DRHistorySchema');

var DR1DB = require('../connections/DR1Connections');

var DR1 = {
	data: DR1DB.dataDB.model('DR1Data', DRDataSchema),
	history: DR1DB.historyDB.model('DR1History', DRHistorySchema)
};

module.exports = DR1;