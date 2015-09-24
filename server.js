var express = require('express');
var compress = require('compression');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
app.set('port', process.env.PORT || 80);


app.use(compress());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/client')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/partials', express.static(__dirname + '/client/partials'));
// app.get('*', function(req, res) {
//     res.sendFile(express.static(__dirname + '/client/index.html'));
// });

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

// Database Connections

var ADR1ADDR = 'mongodb://localhost';
var ADR2ADDR = 'mongodb://localhost';
var DR1ADDR = 'mongodb://localhost';
var DR2ADDR = 'mongodb://localhost';

var ADR1JobDB = mongoose.createConnection(ADR1ADDR + '/jobs');
var ADR1ControlDB = mongoose.createConnection(ADR1ADDR + '/control');
var ADR1DataDB = mongoose.createConnection(ADR1ADDR + '/data');
var ADR2JobDB = mongoose.createConnection(ADR2ADDR + '/jobs');
var ADR2ControlDB = mongoose.createConnection(ADR2ADDR + '/data');
var ADR2DataDB = mongoose.createConnection(ADR2ADDR + '/data');
var ADR2HistoryDB = mongoose.createConnection(ADR2ADDR + '/history');
var DR1DataDB = mongoose.createConnection(DR1ADDR + '/data');
var DR1HistoryDB = mongoose.createConnection(DR1ADDR + '/history')
var DR2DataDB = mongoose.createConnection(DR2ADDR + '/dr2');


// Schema Contructions

var jobSchema = {
    type: String,
    finishTime: Date,
    startTime: Date, //Subtract one hour
    completed: Boolean,
    percentDone: Number,
    dateString: String,
    timeString: String,
    scheduledOn: Date,
    inProgress: Boolean
};
var DRDataSchema = {
    timeStamp: Number,
    t1: Number,
    t3: Number,
    t4: Number,
    t5: Number,
    t6: Number,
    t7: Number,
    t8: Number
};
var DRHistorySchema = {
    timeStamp: Number,
    t1: Number,
    t3: Number,
    t4: Number,
    t5: Number,
    t6: Number,
    t7: Number,
    t8: Number,
    note: String,
    status: String
};
var ADRDataSchema = {
    timeStamp: Number,
    baseTemp: Number,
    oneKTemp: Number,
    threeKTemp: Number,
    sixtyKTemp: Number,
    magnetVoltage: Number,
    psVoltage: Number,
    psCurrent: Number,
    currentJob: String,
    percentComplete: Number,
    switchState: String
};

var ADRHistorySchema = {
    timeStamp: Number,
    baseTemp: Number,
    oneKTemp: Number,
    threeKTemp: Number,
    sixtyKTemp: Number,
    note: String,
    status: String
};

var ADRControlSchema = {
    timeStamp: Number,
    fridgeStatus: String,
    currentJob: String,
    switchState: String,
    currentLimit: Number,
    maxVoltage: Number,
    voltageStep: Number,
    command: String
}

// Connect Schemas to Databases

var ADR1Job = ADR1JobDB.model('ADR1Job', jobSchema);
var ADR1Control = ADR1ControlDB.model('ADR1Control', ADRControlSchema);
var ADR1Data = ADR1DataDB.model('ADR1Data', ADRDataSchema);

var ADR2Job = ADR2JobDB.model('ADR2Job', jobSchema);
var ADR2Control = ADR2ControlDB.model('ADR2Control', ADRControlSchema);
var ADR2Data = ADR2DataDB.model('ADR2Data', ADRDataSchema);
var ADR2History = ADR2HistoryDB.model('ADR2History', ADRHistorySchema);

var DR1Data = DR1DataDB.model('DR1Data', DRDataSchema);
var DR2Data = DR2DataDB.model('DR2Data', DRDataSchema);
var DR1History = DR1HistoryDB.model('DR1History', DRHistorySchema);

// Get all jobs
app.get('/getJobs', function(req, res) {

    switch(req.query.fridge) {
        case 'ADR1': var jobsDB = ADR1Job; break;
        case 'ADR2': var jobsDB = ADR2Job; break;
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

    switch(req.body.fridge) {
        case 'ADR1': var jobsDB = ADR1Job; break;
        case 'ADR2': var jobsDB = ADR2Job; break;
    }

    var data = JSON.parse(req.body.data);
    console.log('Recieved ' + data.length + ' jobs.');

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
            } else console.log('Success');
        });
    }
});

// Remove by id
app.post('/removeJob', function  (req, res) {

    switch(req.body.fridge) {
        case 'ADR1': var jobsDB = ADR1Job; break;
        case 'ADR2': var jobsDB = ADR2Job; break;
    }

    var id = JSON.parse(req.body.data)._id;
    jobsDB.remove({_id: id}, function(err) {
        if (!err) {
            console.log('Job ' + id + ' removed.');
            res.send('Job removed.');
        } else {
            console.log('Job not removed.');
            console.log('err');
            res.send('Job not removed. - server');
        }
    });
});

app.get('/getData', function(req, res) {

    switch(req.query.fridge) {
        case 'DR1': var dataDB = DR1Data; break;
        case 'DR2': var dataDB = DR2Data; break;
        case 'ADR1': var dataDB = ADR1Data; break;
        case 'ADR2': var dataDB = ADR2Data; break;
    }

    dataDB.find().limit(req.query.num)
        .sort({ timeStamp: -1}).exec(function(err, data) {
    if (err || !data) console.log('No data found.');
        else {
            res.json(data);
            res.flush();
        }
    });
});

app.get('/control', function (req, res) {

    switch(req.query.fridge) {
        case 'ADR1': var dataDB = ADR1Control; break;
        case 'ADR2': var dataDB = ADR2Control; break;
    }

    dataDB.findOneAndUpdate({}, {'$set': {'command': req.query.command}})
                .exec(function(err, data) {
                    if (err || !data) console.log('Error.');
                        else {
                            console.log(data);
                            res.json(data);
                            res.flush();
                        }
                });



    // switch (req.query.fridge) {
    //     case 'ADR1':
    //     console.log('Changing ADR1Control')
    //         ADR1Control.findOneAndUpdate({}, req.query.changes)
    //             .exec(function(err, data) {
    //                 if (err || !data) console.log('Error.');
    //                     else {
    //                         console.log(data);
    //                         res.json(data);
    //                         res.flush();
    //                     }
    //             });
    //         break;

    //     case 'ADR2':
    //         console.log('Changing ADR2Control')
    //         console.log(req.query.changes)
    //         ADR2Control.findOneAndUpdate({}, {'$set': {'command': req.query.command}})
    //             .exec(function(err, data) {
    //                 if (err || !data) console.log('Error.');
    //                     else {
    //                         console.log(data);
    //                         res.json(data);
    //                         res.flush();
    //                     }
    //             });
    //         break;
    // }
});

app.get('/history', function (req, res) {
    console.log('Getting History')

    switch(req.query.fridge) {
        case 'DR1': var dataDB = DR1History; break;
        case 'DR2': var dataDB = DR2History; break;
        case 'ADR1': var dataDB = ADR1History; break;
        case 'ADR2': var dataDB = ADR2History; break;
    }


    dataDB.find()
    .sort({timeStamp: -1}).exec(function  (err, data) {
        if (err || !data) console.log('No History Found.');
            else {
                res.json(data);
                res.flush();
            }
    });

});

app.post('/history', function  (req, res) {
    console.log('Adding History Point')

    switch(req.body.fridge) {
        case 'ADR1': var historyDB = ADR1History; var dataDB = ADR1Data; break;
        case 'ADR2': var historyDB = ADR2History; var dataDB = ADR2Data; break;
    }

     dataDB.find().limit(1).sort({ timeStamp: -1}).exec(function(err, data) {
            if (err || !data) console.log('No data found.');
                else {
                    console.log("inserting")
                    console.log(req.body)
                    var point = new historyDB(data[0], {'note': req.body.note});
                    point.note = req.body.note
                    point.save(function(err) {
                        if (err) {
                            res.send('Error - server');
                            console.log(err);
                        } else console.log('Success');
                    });
                }
            });

})
