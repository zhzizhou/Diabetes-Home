const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const patientSchema = new mongoose.Schema({
    givenName: { type: String, required: true },
    familyName: { type: String, required: true },
    password: { type: String, requied: true },
    email: { type: String, unique: true },
    mobile: { type: String },
    weight: { type: String },
    height: { type: String },
    profilePicture: String,
    nickName: String,
    gender: String,
    engagementRate: Number,
    diabeteType: String,
    darkMode: { type: Boolean, default: false },
    dateOfBirth: { type: String },
    registerDate: { type: Date, default: Date.now },
    clinicianId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinician',
        required: true,
    },
    timeSeries: [{
        logItem: { type: String, requied: true },
        activated: { type: Boolean, default: true },
        lowerLimit: { type: Number, requied: true, min: 0 },
        upperLimit: { type: Number, requied: true },
    }, ],
})

patientSchema.methods.verifyPassword = function(password, callback) {
    bcrypt.compare(password, this.password, (err, valid) => {
        callback(err, valid)
    })
}


patientSchema.pre('save', function save(next) {
    const patient = this
    const SALT_FACTOR = 10

    if (!patient.isModified('password')) {
        return next()
    }

    bcrypt.hash(patient.password, SALT_FACTOR, (err, hash) => {
        if (err) {
            return next(err)
        }
        patient.password = hash
        next()
    })
})

const Patient = mongoose.model('Patient', patientSchema)
module.exports = Patient