var ADRDataSchema = require('../schemas/ADRDataSchema');
var ADRHistorySchema = require('../schemas/ADRHistorySchema');
var ADRControlSchema = require('../schemas/ADRControlSchema');
var jobSchema = require('../schemas/jobSchema')

var ADR1DB = require('../connections/ADR1Connections')

var ADR1 = {
	data: ADR1DB.dataDB.model('ADR1Data', ADRDataSchema),
	history: ADR1DB.historyDB.model('ADR1History', ADRHistorySchema),
	control: ADR1DB.controlDB.model('ADR1Control', ADRControlSchema),
	job: ADR1DB.jobDB.model('ADR1Job', jobSchema)
}

module.exports = ADR1;