var ADRDataSchema = require('../schemas/ADRDataSchema');
var ADRHistorySchema = require('../schemas/ADRHistorySchema');
var ADRControlSchema = require('../schemas/ADRControlSchema');
var jobSchema = require('../schemas/jobSchema')

var ADR2DB = require('../connections/ADR2Connections')

var ADR2 = {
	data: ADR2DB.dataDB.model('ADR2Data', ADRDataSchema),
	history: ADR2DB.historyDB.model('ADR2History', ADRHistorySchema),
	control: ADR2DB.controlDB.model('ADR2Control', ADRControlSchema),
	job: ADR2DB.jobDB.model('ADR2Job', jobSchema)
}

module.exports = ADR2;