var DRDataSchema = require('../schemas/DRDataSchema');
var DRHistorySchema = require('../schemas/DRHistorySchema');
var DRControlSchema = require('../schemas/DRControlSchema')
var DR1DB = require('../connections/DR1Connections');

var DR1 = {
	data: DR1DB.dataDB.model('DR1Data', DRDataSchema),
	control: DR1DB.controlDB.model("DR1Control", DRControlSchema),
	history: DR1DB.historyDB.model('DR1History', DRHistorySchema)
};

module.exports = DR1;