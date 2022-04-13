const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
    givenName:{type: String, required: true},
    familyName:{type: String, required: true},
    password:{type: String, requied: true},
    email:{type: String,unique: true},
    mobileNumber: {type:String},
    profilePicture: String,
    nickName: String,
    gender: String,
    engagementRate : Number,
    diabeteType:String,
    darkMode: {type: Boolean, default: false},
    dateOfBirth: {type: String},
    clinicianId: {type: mongoose.Schema.Types.ObjectId, ref: 'Clinician'}
})

const Patient = mongoose.model('Patient',patientSchema)

const PateintDemo = [{
    	_id: "1",
        givenName: "Mary",
        familyName: "Shelly",
        password: "12345",
        email: "mary@diabeteshome.com",
        mobileNumber: "0123456789",
        profilePicture: "defaultPic",
        nickName: "Mary",
        gender: "Female",
        engagementRate: 80,
        diabeteType: "Type 1",
        darkMode: false,
        dateOfBirth: "1/1/1990",
        clinicianId: "1"
    },
    {
        _id: "2",
        givenName: "Pat",
        familyName: "Jones",
        password: "12345",
        email: "pat@diabeteshome.com",
        mobileNumber: "0123456789",
        profilePicture: "defaultPic",
        nickName: "Andy",
        gender: "Male",
        engagementRate: 85,
        diabeteType: "Type 2",
        darkMode: false,
        dateOfBirth: "1/1/1990",
        clinicianId: "1"
    },
]

module.exports = Patient