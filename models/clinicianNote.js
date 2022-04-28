const mongoose = require('mongoose')

const clinicianNoteSchema = new mongoose.Schema({
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

const clinicianNote = mongoose.model('clinicianNote', clinicianNoteSchema)

module.exports = clinicianNote