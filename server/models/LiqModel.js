var liqSchema = require('../schemas/liqSchema');
var liqDB = require('../connections/liqConnections')

var Liq = {
	data: liqDB.dataDB.model('liqData', liqSchema)
}

module.exports = Liq;