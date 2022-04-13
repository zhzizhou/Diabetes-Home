const mongoose = require('mongoose')

const clinicianSchema = new mongoose.Schema({
    givenName:{type: String, required: true},
    familyName:{type: String, required: true},
    password:{type: String, requied: true},
    email:{type: String,unique: true},
    dateOfBirth: {type: String},
    darkMode: {type: Boolean, default: false},
    mobileNumber: {type:String},
    profilePicture: String,
    gender: String
})

const Clinician = mongoose.model('Clinician', clinicianSchema)

const clinicianDemo = [{
    _id: "1",
    firstName: "Chris",
    lastName: "Smith",
    password: "12345",
    email: "Chris@diabetesAtHome.com",
    dateOfBirth: "1/1/1990",
    darkMode: false,
    mobileNumber: "0123456789",
    profilePicture: "defaultPic",
    gender: "Male"
}]


module.exports = Clinician