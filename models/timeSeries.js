const mongoose = require("mongoose")

const timeSeriesSchema = new mongoose.Schema({
    patientId: {type:mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true},
    logItemId: {type:Number, required: true},
    activated: {type: Boolean, default: true},
    upperLimit: {type: Number, required: true},
    lowerLimit: {type: Number, required: true, min: 0}
})

const timeSeriesDemo = [
    {
        patientId: 10001,
        logItemId: 1,
        activated: true,
        upperLimit: 70,
        lowerLimit: 60,
    },
    {
        patientId: 10001,
        logItemId: 2,
        activated: true,
        upperLimit: 2,
        lowerLimit: 1,
    },
    {
        patientId: 10001,
        logItemId: 3,
        activated: true,
        upperLimit: 15000,
        lowerLimit: 5000,
    },
    {
        patientId: 10001,
        logItemId: 4,
        activated: true,
        upperLimit: 11.1,
        lowerLimit: 7.8,
    },
    {
        patientId: 10002,
        logItemId: 1,
        activated: false,
        upperLimit: 70,
        lowerLimit: 60,
    },
    {
        patientId: 10002,
        logItemId: 2,
        activated: true,
        upperLimit: 2,
        lowerLimit: 1,
    },
    {
        patientId: 10002,
        logItemId: 3,
        activated: true,
        upperLimit: 18000,
        lowerLimit: 6000,
    },
    {
        patientId: 10002,
        logItemId: 4,
        activated: true,
        upperLimit: 11.3,
        lowerLimit: 7.8,
    },
]

const TimeSeries = mongoose.model('TimeSeries', timeSeriesSchema)