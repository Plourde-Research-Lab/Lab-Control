var DRDataSchema = require('../schemas/DRDataSchema');
var DRHistorySchema = require('../schemas/DRHistorySchema');

var DR2DB = require('../connections/DR2Connections');

var DR2 = {
	data: DR2DB.dataDB.model('DR2Data', DRDataSchema),
	history: DR2DB.historyDB.model('DR2History', DRHistorySchema)
};

module.exports = DR2;