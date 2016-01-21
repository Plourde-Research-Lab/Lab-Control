var ADRControlSchema = {
    timeStamp: Number,
    fridgeStatus: String,
    currentJob: String,
    switchState: String,
    currentLimit: Number,
    maxVoltage: Number,
    voltageStep: Number,
    command: String
};

module.exports = ADRControlSchema;