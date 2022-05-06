const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const clinicianSchema = new mongoose.Schema({
    givenName: { type: String, required: true },
    familyName: { type: String, required: true },
    password: { type: String, requied: true },
    email: { type: String, unique: true },
    dateOfBirth: { type: String },
    darkMode: { type: Boolean, default: false },
    mobile: { type: String },
    profilePicture: String,
    gender: String,
})

clinicianSchema.methods.verifyPassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, valid) => {
        callback(err, valid)
    })
}

clinicianSchema.pre('save', function save(next) {
    const clinician = this
    const SALT_FACTOR = 10

    if (!clinician.isModified('password')) {
        return next()
    }

    bcrypt.hash(clinician.password, SALT_FACTOR, (err, hash) => {
        if (err) {
            return next(err)
        }
        clinician.password = hash
        next()
    })
})

const Clinician = mongoose.model('Clinician', clinicianSchema)

module.exports = Clinician