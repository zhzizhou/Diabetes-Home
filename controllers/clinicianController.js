const Clinician = require('../models/clinician')
const Patient = require('../models/patient')
const expressValidator = require('express-validator')
const utility = require('../utils/utils')
const bcrypt = require('bcryptjs')

const getHome = async(req, res) => {
    res.send('GET Home')
        //TODO
}

const getAllClinician = async(req, res, next) => {
    try {
        const clinician = await Clinician.find().lean()
        return res.render('allClinician-Test', { data: clinician })
    } catch (err) {
        return next(err)
    }
}

const getProfile = async(req, res, next) => {
    //http://localhost:3000/clinician/6259359d8c4f458dd2205d20
    try {
        const clinician = await Clinician.findById(
            req.params.clinician_id
        ).lean()

        if (!clinician) {
            return res.sendStatus(404)
        }

        //found clinician
        return res.render('clinicianData', { oneItem: clinician })
    } catch (err) {
        return next(err)
    }
}

const getEditPage = async(req, res) => {
    res.send('GET EditPage')
        //TODO
}

const updateProfile = async(req, res) => {
    res.send('PUT updateProfile')
        //TODO
}

const getSettings = async(req, res) => {
    res.send('GET Settings')
        //TODO
}

const updateSettings = async(req, res) => {
    res.send('PUT Settings')
        //TODO
}

const getRegisterPage = async(req, res) => {
    res.send('GET RegisterPage')
        //TODO
}

const registerClinician = async(req, res) => {
    console.log(req.body)
    try {
        const hashedPwd = await bcrypt.hash(req.body.password, 10)
        const newClinician = new Clinician({
            givenName: req.body.givenName,
            familyName: req.body.familyName,
            password: hashedPwd,
            email: req.body.email,
            dateOfBirth: req.body.dateOfBirth,
            darkMode: false,
            mobile: req.body.mobile,
            profilePicture: 'defaultPic',
            gender: req.body.gender,
        })
        await newClinician
            .save()
            .then((result) => res.send(result))
            .catch((err) => res.send(err))
    } catch {
        res.send('internal error')
    }
}

const getNewPatientPage = async(req, res) => {
    res.send('GET NewPatientPage')
        //TODO
}

const addNewPatient = async(req, res) => {
    //fake Id for temporary use
    var clinicianId = '6256dde2082aa786c9760f98'
    console.log(req.body)
    try {
        const hashedPwd = await bcrypt.hash(req.body.password, 10)

        var defaultTimeSeries = [{
                logItem: 'Weight',
                lowerLimit: 60,
                upperLimit: 80,
            },
            {
                logItem: 'Insulin Doses',
                lowerLimit: 1,
                upperLimit: 2,
            },
            {
                logItem: 'Exercise Steps',
                lowerLimit: 5000,
                upperLimit: 15000,
            },
            {
                logItem: 'Blood Glucose Level',
                lowerLimit: 7.8,
                upperLimit: 11.3,
            },
        ]
        const newPatient = new Patient({
            givenName: req.body.givenName,
            familyName: req.body.familyName,
            password: hashedPwd,
            email: req.body.email,
            mobile: req.body.mobile,
            profilePicture: 'defaultPic',
            nickName: req.body.givenName,
            gender: req.body.gender,
            engagementRate: 100,
            diabeteType: req.body.diabeteType,
            darkMode: false,
            dateOfBirth: req.body.dateOfBirth,
            clinicianId: clinicianId,
            timeSeries: defaultTimeSeries,
        })

        await newPatient.save().catch((err) => res.send(err))
    } catch {
        res.send('internal error')
    }
    res.send('register patient sucessful')
}

const getMyPatientPage = async (req, res) => {
    var cId = '6256dde2082aa786c9760f98'
    var saveQuery = {'male': true, 'female': true}

    try {
        const allPatient = await Patient.find(
            {clinicianId: cId},
            {
                givenName: true,
                familyName: true,
                dateOfBirth: true,
                diabeteType: true,
                gender: true
            }
        ).lean()
        var totalPatient = allPatient.length 
        for(let i = 0; i < totalPatient; i++){
            allPatient[i]['age'] = utility.getAge(allPatient[i].dateOfBirth)
        }
        console.log(allPatient)
        res.render('my-patient',{title: 'My Patients',patients: allPatient,
        total: totalPatient, query: saveQuery, doctor: {givenName:'Chris', familyName:"Smith"}})
    } catch (err) {
        console.log(err)
    }
}

const searchPatient = async (req, res) => {
    console.log(req.body)
    var query = {}
    var saveQuery={}
    
	if (req.body.pname !== '') {
        var reg = new RegExp(req.body.pname,"i")
		query['$or'] = [{'givenName': reg}, {'familyName':reg}]
        saveQuery['nameExist'] = true
        saveQuery['pname'] = req.body.pname
	}

	if (req.body.diabeteType) {
		if(req.body.diabeteType !== 'All Types'){
            query['diabeteType'] = req.body.diabeteType
            switch(req.body.diabeteType){
                case 'Type 1':
                    saveQuery['type1Exist'] = true
                    break
                case 'Type 2':
                    saveQuery['type2Exist'] = true
                    break
                case 'Gestational':
                    saveQuery['typegExist'] = true
            }
        }
	}

    if(!req.body.male || !req.body.female){
        if(req.body.male){
            query["gender"] = "Male"
            saveQuery['male'] = true
        }else if(req.body.female){
            query["gender"] = "Female"
            saveQuery['female'] = true
        }
    }else{
        saveQuery['male'] = true
        saveQuery['female'] = true
    }

    console.log(query)
	try {
		const result = await Patient.find(
            query,
            {
                givenName: true,
                familyName: true,
                dateOfBirth: true,
                diabeteType: true,
                gender: true
            }
        ).lean()
        var totalPatient = result.length 
        for(let i = 0; i < totalPatient; i++){
            result[i]['age'] = utility.getAge(result[i].dateOfBirth)
        }
        res.render('my-patient',{title: 'My Patients',patients: result,
        total: totalPatient, query: saveQuery, doctor: {givenName:'Chris', familyName:"Smith"}})
	} catch (err) {
		console.log(err)
	}
}

const getOnePatientPage = async(req, res) => {
    res.send('GET OnePatientPage')
        //TODO
}

const getSupportPage = async(req, res) => {
    res.send('GET SupportPage')
        //TODO
}

const addSupport = async(req, res) => {
    res.send('POST addSupport')
        //TODO
}

const getNotesPage = async(req, res) => {
    res.send('GET NotesPage')
        //TODO
}

const addNotes = async(req, res) => {
    res.send('POST addNotes')
        //TODO
}

const getTimeSeriesPage = async(req, res) => {
    res.send('GET getTimeSeriesPage')
        //TODO
}

const updateTimeSeries = async(req, res) => {
    res.send('PUT updateTimeSeries')
        //TODO
}

const getPatientDetail = async(req, res) => {
    res.send('GET PatientDetail')
        //TODO
}

const getEditPatientPage = async(req, res) => {
    res.send('GET EditPatientPage')
        //TODO
}

const updatePatientDetail = async(req, res) => {
    res.send('POST updatePatientDetail')
        //TODO
}

const getLoginPage = async(req, res) => {
    res.send('GET LoginPage')
        //TODO
}

const clinicianLogin = async(req, res) => {
    res.send('POST clinicianLogin')
        //TODO
}

module.exports = {
    getHome,
    getProfile,
    getEditPage,
    updateProfile,
    getSettings,
    updateSettings,
    getRegisterPage,
    registerClinician,
    getNewPatientPage,
    addNewPatient,
    getMyPatientPage,
    searchPatient,
    getOnePatientPage,
    getSupportPage,
    addSupport,
    getNotesPage,
    addNotes,
    getTimeSeriesPage,
    updateTimeSeries,
    getPatientDetail,
    getEditPatientPage,
    updatePatientDetail,
    getLoginPage,
    clinicianLogin,
    getAllClinician,
}