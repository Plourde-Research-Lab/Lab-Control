var express = require('express');
var compress = require('compression');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var json2csv = require('json2csv');
var fs = require('fs');

///////////////////////////////////////////////////////////////
////////////////// SET UP EXPRESS SERVER //////////////////////
///////////////////////////////////////////////////////////////

var app = express();

app.set('port', process.env.PORT || 80);

app.use(compress());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/client')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/partials', express.static(__dirname + '/client/partials'));

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

///////////////////////////////////////////////////////////////
///////////////////////// API /////////////////////////////////
///////////////////////////////////////////////////////////////

// Import Fridge Models
///////////////////////////////////////////////////////////////

var ADR1 = require('./server/models/ADR1Model');
var ADR2 = require('./server/models/ADR2Model');
var DR1 = require('./server/models/DR1Model');
var DR2 = require('./server/models/DR2Model');
var Liq = require('./server/models/LiqModel');

// HTTP requests
///////////////////////////////////////////////////////////////

//Get status of all fridges
app.get('/status', function(req, res) {
    switch (req.query.fridge) {
        case 'ADR1':
            var dataDB = ADR1.control;
            break;
        case 'ADR2':
            var dataDB = ADR2.control;
            break;
        case 'DR1':
            var dataDB = DR1.data;
            break;
        case 'DR2':
            var dataDB = DR2.data;
            break;
    }
    dataDB.findOne({}).exec(function(err, data) {
        res.json(data)
    })
});

// Get all jobs
app.get('/getJobs', function(req, res) {
    switch (req.query.fridge) {
        case 'ADR1':
            var jobsDB = ADR1.job;
            break;
        case 'ADR2':
            var jobsDB = ADR2.job;
            break;
    }

    jobsDB.find('', function(err, jobs) {
        if (err || !jobs) console.log('No jobs found.');
        else {
            res.send(jobs);
        }
    });
});

// Add jobs
app.post('/addJobs', function(req, res) {
    switch (req.body.fridge) {
        case 'ADR1':
            var jobsDB = ADR1.job;
            break;
        case 'ADR2':
            var jobsDB = ADR2.job;
            break;
    }

    var data = JSON.parse(req.body.data);

    for (var i = data.length - 1; i >= 0; i--) {
        var job = new jobsDB;
        job.type = data[i].type;
        job.finishTime = data[i].finishTime;
        job.startTime = data[i].startTime;
        job.completed = data[i].completed;
        job.percentDone = data[i].percentDone;
        job.dateString = data[i].dateString;
        job.timeString = data[i].timeString;
        job.scheduledOn = data[i].scheduledOn;
        job.inProgress = data[i].inProgress;
        job.save(function(err) {
            if (err) {
                res.send('Error - server');
                console.log(err);
            };
        });
    }
});

// Remove by id
app.post('/removeJob', function(req, res) {
    switch (req.body.fridge) {
        case 'ADR1':
            var jobsDB = ADR1.job;
            break;
        case 'ADR2':
            var jobsDB = ADR2.job;
            break;
    }

    var id = JSON.parse(req.body.data)._id;
    jobsDB.remove({
        _id: id
    }, function(err) {
        if (!err) {
            res.send('Job removed.');
        } else {
            console.log('Job not removed.');
            console.log('err');
            res.send('Job not removed. - server');
        }
    });
});

// Get Data for fridge
app.get('/getData', function(req, res) {
    switch (req.query.fridge) {
        case 'DR1':
            var dataDB = DR1.data;
            break;
        case 'DR2':
            var dataDB = DR2.data;
            break;
        case 'ADR1':
            var dataDB = ADR1.data;
            break;
        case 'ADR2':
            var dataDB = ADR2.data;
            break;
    }

    dataDB.find().limit(req.query.num)
        .sort({
            timeStamp: -1
        }).exec(function(err, data) {
            if (err || !data) console.log('No data found.');
            else {
                res.json(data);
                res.flush();
            }
        });
});

app.get('/downloadData', function(req, res) {
    switch (req.query.fridge) {
        case 'DR1':
            var dataDB = DR1.data;
            break;
        case 'DR2':
            var dataDB = DR2.data;
            break;
        case 'ADR1':
            var dataDB = ADR1.data;
            break;
        case 'ADR2':
            var dataDB = ADR2.data;
            break;
    }

    dataDB.find().limit(req.query.num)
        .sort({
            timeStamp: -1
        }).exec(function(err, data) {
            if (err || !data) console.log('No data found.');
            else {
                // res.json(data);
                // res.flush();
                json2csv({
                    data: data,
                    fields: ['timeStamp', 'sixtyKTemp', 'threeKTemp', 'baseTemp']
                }, function(err, csv) {
                    if (err) console.log(err);
                    fs.writeFile('file.csv', csv, function(err) {
                        if (err) throw err;
                        console.log('File Downloaded');
                        // res.setHeader('Content-disposition', 'attachment; filename=data.csv');
                        // res.setHeader('Content-type', 'text/csv');
                        // var filestream = fs.createReadStream('file.csv');
                        // filestream.pipe(res);
                        res.download('file.csv');
                    });
                });
            }
        });
});

// Set Controls for ADRs
app.get('/control', function(req, res) {
    switch (req.query.fridge) {
        case 'ADR1':
            var dataDB = ADR1.control;
            break;
        case 'ADR2':
            var dataDB = ADR2.control;
            break;
    }

    dataDB.findOneAndUpdate({}, {
            '$set': {
                'command': req.query.command
            }
        })
        .exec(function(err, data) {
            if (err || !data) console.log('Error.');
            else {
                console.log(data);
                res.json(data);
                res.flush();
            }
        });
});

// Get History Data
app.get('/history', function(req, res) {
    switch (req.query.fridge) {
        case 'DR1':
            var dataDB = DR1.history;
            break;
        case 'DR2':
            var dataDB = DR2.history;
            break;
        case 'ADR1':
            var dataDB = ADR1.history;
            break;
        case 'ADR2':
            var dataDB = ADR2.history;
            break;
    }

    dataDB.find()
        .sort({
            timeStamp: -1
        }).exec(function(err, data) {
            if (err || !data) console.log('No History Found.');
            else {
                res.json(data);
                res.flush();
            }
        });
});

// Post History Data
app.post('/history', function(req, res) {
    switch (req.body.fridge) {
        case 'ADR1':
            var historyDB = ADR1.history;
            var dataDB = ADR1.data;
            break;
        case 'ADR2':
            var historyDB = ADR2.history;
            var dataDB = ADR2.data;
            break;
    }

    dataDB.find().limit(1).sort({
        timeStamp: -1
    }).exec(function(err, data) {
        if (err || !data) console.log('No data found.');
        else {
            console.log("inserting")
            console.log(req.body)
            var point = new historyDB(data[0], {
                'note': req.body.note
            });
            point.note = req.body.note
            point.save(function(err) {
                if (err) {
                    res.send('Error - server');
                    console.log(err);
                } else console.log('Success');
            });
        }
    });
});

// Liquifier Functionality

app.get('/latestEntry', function(req, res) {
    console.log("Got latestEntry req");
    Liq.data.find().limit(1)
        .sort({
            timeStamp: -1
    }).exec(function(err, data) {
        if (err || !data) console.log('No data found.');
        else {
            res.json(data);
            res.flush();
        }
    });
});

app.get('/latestFive', function(req, res) {
    console.log("Got latestFive req");
    Liq.data.find().limit(5).sort({
        timeStamp: -1
    }).exec(function(err, docs) {
        console.log(docs);
        res.json(docs);
    });
});

app.get('/getLiqData', function(req, res) {
    console.log("Got varEntries req with req = ", req.query.num);
    Liq.data.find({
        timeStamp: {
            $gt: parseInt(req.query.num)
        }
    }).sort({
        timeStamp: -1
    }).exec(function(err, docs) {
        console.log(docs);
        res.json(docs);
    });
});
