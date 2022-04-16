const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
    givenName: { type: String, required: true },
    familyName: { type: String, required: true },
    password: { type: String, requied: true },
    email: { type: String, unique: true },
    mobile: { type: String },
    profilePicture: String,
    nickName: String,
    gender: String,
    engagementRate: Number,
    diabeteType: String,
    darkMode: { type: Boolean, default: false },
    dateOfBirth: { type: String },
    clinicianId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinician',
        required: true,
    },
    timeSeries: [
        {
            logItem: { type: String, requied: true },
            activated: { type: Boolean, default: true },
            lowerLimit: { type: Number, requied: true, min: 0 },
            upperLimit: { type: Number, requied: true },
        },
    ],
})

const Patient = mongoose.model('Patient', patientSchema)

const PateintDemo = [
    {
        _id: 10001,
        givenName: 'Patrick',
        familyName: 'Star',
        password: '12345',
        email: 'mary@diabeteshome.com',
        mobile: '0123456789',
        profilePicture: 'defaultPic',
        nickName: 'Pat',
        gender: 'Male',
        engagementRate: 80,
        diabeteType: 'Type 1',
        darkMode: false,
        dateOfBirth: '1/1/1990',
        clinicianId: 1,
    },
    // {
    //     _id: 10002,
    //     givenName: "Pat",
    //     familyName: "Jones",
    //     password: "12345",
    //     email: "pat@diabeteshome.com",
    //     mobile: "0123456789",
    //     profilePicture: "defaultPic",
    //     nickName: "Andy",
    //     gender: "Male",
    //     engagementRate: 85,
    //     diabeteType: "Type 2",
    //     darkMode: false,
    //     dateOfBirth: "1/1/1990",
    //     clinicianId: "1"
    // },
]

module.exports = Patient
