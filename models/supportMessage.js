const mongoose = require('mongoose')

const supportMesssageSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    clinicianId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinician',
        required: true,
    },
    content: { type: String, required: true },
    when: { type: Date, default: Date.now },
})

const supportMesssage = mongoose.model('SupportMessage', supportMesssageSchema)

module.exports = supportMesssage