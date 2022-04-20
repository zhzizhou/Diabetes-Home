const mongoose = require('mongoose')

const healthRecordSchema = new mongoose.Schema({
    logItemId: {
        type: Number,
        required: true,
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    value: { type: Number, required: true, min: 0 },
    notes: String,
    when: { type: Date, default: Date.now },
})

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema)

module.exports = HealthRecord
