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
    engagementRate : Number,
    diabeteType:String,
    darkMode: {type: Boolean, default: false},
    dateOfBirth: {type: String},
    clinicianId: {type: mongoose.Schema.Types.ObjectId, ref: 'Clinician'}
})

const clinicianSchema = new mongoose.Schema({
    givenName:{type: String, required: true},
    familyName:{type: String, required: true},
    password:{type: String, requied: true},
    email:{type: String,unique: true},
    dateOfBirth: {type: String},
    darkMode: {type: Boolean, default: false},
    profilePicture: String,
    gender: String
})

const healthRecordSchema = new mongoose.Schema({
    itemId: {type: mongoose.Schema.Types.ObjectId, ref:'RecordItem', required: true},
    patientId: {type: mongoose.Schema.Types.ObjectId, ref:'Patient', required: true},
    value: {type: Number, required: true, min: 0},
    notes: String,
    when: {type: Date, default: Date.now}
})

const supportSchema = new mongoose.Schema({
    patientId: {type: mongoose.Schema.Types.ObjectId, ref:'Patient', required: true},
    clinicianId:  {type: mongoose.Schema.Types.ObjectId, ref:'Clinician', required: true},
    content: {type: String, required: true},
    when: {type: Date, default: Date.now}
})

const notesSchema = new mongoose.Schema({
    patientId: {type: mongoose.Schema.Types.ObjectId, ref:'Patient', required: true},
    clinicianId:  {type: mongoose.Schema.Types.ObjectId, ref:'Clinician', required: true},
    content: {type: String, required: true},
    when: {type: Date, default: Date.now}
})

const timeSeriesSchema = new mongoose.Schema({
    patientId: {type: mongoose.Schema.Types.ObjectId, ref:'Patient', required: true},
    itemId: {type: mongoose.Schema.Types.ObjectId, ref:'RecordItem', required: true},
    activated: {Boolean, default: true},
    upperLimit: {type: Number, required: true},
    lowerLimit: {type: Number, required: true, min: 0}
})

const recordItemSchema = new mongoose.Schema({
    itemName: {type: String, required: true}
})

const Patient = mongoose.model('Patient',patientSchema)
const Clinician = mongoose.model('Clinician', clinicianSchema)
const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema)
const Support = mongoose.model('Feedback', supportSchema)
const TimeSeries = mongoose.model('RecordLimit', timeSeriesSchema)
const RecordItem = mongoose.model('RecordItem', recordItemSchema)
const Notes = mongoose.model('RecordItem', notesSchema)

module.exports = {Patient, Clinician, HealthRecord, Support, TimeSeries, Notes, RecordItem}






