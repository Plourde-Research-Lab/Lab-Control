var express = require("express");
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/jobs')

var app = express()

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/client')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

var jobSchema = {
	"type": String
}

var Job = mongoose.model('Job', jobSchema);


// app.get('/', function  (req, res) {
// 	Job.find(function  (err, doc) {
// 		res.send(doc);
// 	})
// });