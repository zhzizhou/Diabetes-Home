const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/DiabetesHome',{ useNewUrlParser: true });
const db = mongoose.connection

db.on('error',console.error.bind(console,'connection error'))
db.once('open',() => {
    console.log('connected to Mongo')
})

const patientSchema = new mongoose.Schema({
    givenName:{type: String, required: true},
    familyName:{type: String, required: true},
    password:{type: String, requied: true},
    email:{type: String,unique: true},
    profilePicture: String,
    nickName: String,
    gender: String,
    dateOfBirth: {type: String},
    clinicianId: {type: mongoose.Schema.Types.ObjectId, ref: 'clinician'},
    engagementRate : Number,
    recordWeight : Boolean,
    recordInsulin: Boolean,
    recordBloodGlucose: Boolean,
    recordExercise: Boolean,
    darkMode: Boolean
})

const clinicianSchema = new mongoose.Schema({
    givenName:{type: String, required: true},
    familyName:{type: String, required: true},
    password:{type: String, requied: true},
    email:{type: String,unique: true},
    dateOfBirth: {type: String},
    profilePicture: String,
    gender: String
})

const healthRecordSchema = new mongoose.Schema({
    itemId: {type: mongoose.Schema.Types.ObjectId, ref:'recordItem', required: true},
    patientId: {type: mongoose.Schema.Types.ObjectId, ref:'patient', required: true},
    value: {type: Number, required: true, min: 0},
    notes: String,
    date: Date
})

const feedbackSchema = new mongoose.Schema({
    patientId: {type: mongoose.Schema.Types.ObjectId, ref:'patient', required: true},
    clinicianId:  {type: mongoose.Schema.Types.ObjectId, ref:'clinician', required: true},
    content: {type: String, required: true},
    date: Date
})

const recordLimitSchema = new mongoose.Schema({
    patientId: {type: mongoose.Schema.Types.ObjectId, ref:'patient', required: true},
    itemId: {type: mongoose.Schema.Types.ObjectId, ref:'recordItem', required: true},
    upperLimit: {type: Number, required: true},
    lowerLimit: {type: Number, required: true, min: 0}
})

const recordItemSchema = new mongoose.Schema({
    itemName: {type: String, required: true}
})

const Patient = mongoose.model('Patient',patientSchema)
const Clinician = mongoose.model('Clinician', clinicianSchema)
const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema)
const Feedback = mongoose.model('Feedback', feedbackSchema)
const RecordLimit = mongoose.model('RecordLimit', recordLimitSchema)
const RecordItemSchema = mongoose.model('RecordItem', recordItemSchema)

module.exports = {Patient, Clinician, HealthRecord, Feedback, RecordLimit, RecordItemSchema}






