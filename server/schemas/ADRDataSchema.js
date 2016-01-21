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

module.exports = ADRDataSchema;