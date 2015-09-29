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

module.exports = jobSchema;