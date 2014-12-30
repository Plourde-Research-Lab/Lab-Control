var express = require("express");
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");

var app = express()
app.set('port', process.env.PORT || 3000);
var io = require('socket.io').listen(app.listen())

io.on('connection', function (){
	console.log('connected');
})

// require('./config').(app, io);
// require('./routes').(app, io);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/client')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

// Database Connections

var ADR1JobDB = mongoose.createConnection('mongodb://localhost/jobs1');
var ADR1DataDB = mongoose.createConnection('mongodb://localhost/adr1');
var ADR2JobDB = mongoose.createConnection('mongodb://localhost/jobs2');
var ADR2DataDB = mongoose.createConnection('mongodb://localhost/adr2');
var DR1DataDB = mongoose.createConnection('mongodb://localhost/dr1');
var DR2DataDB = mongoose.createConnection('mongodb://localhost/dr2');

var testDB = mongoose.createConnection('mongodb://localhost/test');

// Schema Contructions 

var jobSchema = {
	type: String,
	finishTime: Date,
	startTime: Date, //Subtract one hour
	completed: Boolean,
	percentDone: Number,
	dateString: String,
	timeString: String,
	scheduledOn: Date
}
var DRDataSchema = {
	timeStamp: Date,
	temp1: Number,
	temp2: Number,
	temp3: Number,
	temp4: Number,
	temp5: Number,
	temp6: Number
}
var ADRDataSchema = {
	timeStamp: Number,
	baseTemp: Number,
	threeKTemp: Number,
	sixtyKTemp: Number,
	magnetVoltage: Number,
	psVoltage: Number,
	psCurrent: Number,
	currentJob: String,
	percentComplete: Number,
	switchState: String
}

var testSchema = {
	temp: Number
}

var testData = testDB.model('testData', testSchema);

// Connect Schemas to Databases

var ADR1Job = ADR1JobDB.model('ADR1Job', jobSchema);
var ADR1Data = ADR1DataDB.model('ADR1Data', ADRDataSchema);

var ADR2Job = ADR2JobDB.model('ADR2Job', jobSchema);
var ADR2Data = ADR2DataDB.model('ADR2Data', ADRDataSchema);

var DR1Data = DR1DataDB.model('DR1Data', DRDataSchema);
var DR2Data = DR2DataDB.model('DR2Data', DRDataSchema);

// Get all jobs
app.get('/getJobs1', function (req, res) {

	ADR1Job.find('', function (err, jobs) {
		if (err || !jobs) console.log("No jobs found.")
			else {

				res.send(jobs);
			}
	});
});

app.get('/getJobs2', function (req, res) {

	ADR2Job.find('', function (err, jobs) {
		if (err || !jobs) console.log("No jobs found.")
			else {

				res.send(jobs);
			}
	});
});

// Add jobs
app.post('/addJobs1', function (req, res) {
	var data=req.body;
	console.log("Recieved " + data.length + " jobs.");

	for (var i = data.length - 1; i >= 0; i--) {
		var job = new ADR1Job
		job.type = data[i].type
		job.finishTime = data[i].finishTime
		job.startTime = data[i].startTime
		job.completed = data[i].completed
		job.percentDone = data[i].percentDone
		job.dateString = data[i].dateString
		job.timeString = data[i].timeString
		job.scheduledOn = data[i].scheduledOn
		job.save(function(err){
			if (err) {
				res.send('Error - server');
				console.log(err);
			}else console.log('Success');
		});
	};
})

app.post('/addJobs2', function (req, res) {
	var data=req.body;
	console.log("Recieved " + data.length + " jobs.");

	for (var i = data.length - 1; i >= 0; i--) {
		var job = new ADR2Job
		job.type = data[i].type
		job.finishTime = data[i].finishTime
		job.startTime = data[i].startTime
		job.completed = data[i].completed
		job.percentDone = data[i].percentDone
		job.dateString = data[i].dateString
		job.timeString = data[i].timeString
		job.scheduledOn = data[i].scheduledOn
		job.save(function(err){
			if (err) {
				res.send('Error - server');
				console.log(err);
			}else console.log('Success');
		});
	};
})

// Remove by id 
app.post('/removeJob1', function (req, res) {
	var id=req.body._id;
	ADR1Job.remove({_id: id}, function (err) {
		if (!err) {
			console.log("Job " + id + " removed.");
			res.send('Job removed.');
		} else {
			console.log("Job not removed.");
			console.log("err");
			res.send('Job not removed. - server')
		}
	});
})

app.post('/removeJob2', function (req, res) {
	var id=req.body._id;
	ADR2Job.remove({_id: id}, function (err) {
		if (!err) {
			console.log("Job " + id + " removed.");
			res.send('Job removed.');
		} else {
			console.log("Job not removed.");
			console.log("err");
			res.send('Job not removed. - server')
		}
	});
})


// Data Monitors

app.get('/getData', function (req, res) {
	ADR1Data.find().sort({timeStamp: -1}).limit(1).exec(function (err, data){
		if (err || !data) console.log("No data found.")
			else {
				res.json(data);
			}
	});
})

app.get('/getTestData', function (req, res) {
	ADR1Data.find().sort({timeStamp: -1}).limit(1).exec(function (err, data){
		if (err || !data) console.log("No data found.")
			else {
				res.json(data);
			}
	});
})
