const Clinician = require('../models/clinician')
const Patient = require('../models/patient')
const HealthRecord = require('../models/healthRecord')
const SupportMessage = require('../models/support')
const ClinicainNote = require('../models/notes')
const expressValidator = require('express-validator')
const utility = require('../utils/utils')
const moment = require('moment')
const bcrypt = require('bcryptjs')
const { db } = require('../models/healthRecord')

var login

const getHome = async(req, res) => {
    var cId = '6256dde2082aa786c9760f98'
    var currentId
    var healthRecord
    var logItemId
    var alerts = 0
    var comments = 0
    try {
        const patients = await Patient.find({
            clinicianId: cId
        }, {
            givenName: true,
            familyName: true,
            timeSeries: true
        }).lean()
        var now = new Date()
            //for each of the patient get today's health record
        console.log(patients)
        for (let i = 0; i < patients.length; i++) {
            currentId = patients[i]._id;
            healthRecord = await HealthRecord.find({
                patientId: currentId,
                when: {
                    $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate())
                }
            }, {}).lean()
            alerts += 4 - healthRecord.length
                //if the item is not activated then do not alert
            patients[i].timeSeries.forEach(element => {
                    if (!element.activated) {
                        alerts--
                    }
                })
                //inject the log into patient's timeSeries by logId
            for (let j = 0; j < healthRecord.length; j++) {
                logItemId = healthRecord[j].logItemId - 1
                healthRecord[j].when = moment(healthRecord[j].when).format('D/M/YY H:mm:ss')
                if (healthRecord[j].notes !== "") {
                    comments++
                }
                var val = healthRecord[j].value
                var upper = patients[i].timeSeries[logItemId].upperLimit
                var lower = patients[i].timeSeries[logItemId].lowerLimit
                    //check if the value out of threshold
                if (val > upper || val < lower) {
                    alerts++;
                    healthRecord[j]['alert'] = true
                }
                patients[i].timeSeries[logItemId]['log'] = healthRecord[j]
            }
        }
        res.render('clinician-dashboard', {
            patients: patients,
            alert: alerts,
            comment: comments,
            totalPatient: patients.length,
            layout: 'clinician-main',
            doctor: {
                givenName: 'Chris',
                familyName: 'Smith'
            }
        })
    } catch (err) {
        console.log(err)
    }
}

const getProfile = async(req, res) => {
    //http://localhost:3000/clinician/profile
    try {
        const clinician = await Clinician.findById(
            // req.params.clinician_id
            '625e240b01e5ce1b9ef808e9'
        ).lean()

        if (!clinician) {
            return res.sendStatus(404)
        }
        //found clinician
        return res.render('clinicianData', {
            thisClinician: clinician,
            layout: "clinician-main"
        })

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

const getMyPatientPage = async(req, res) => {
    var cId = '6256dde2082aa786c9760f98'
    var saveQuery = {
        'male': true,
        'female': true
    }

    try {
        const allPatient = await Patient.find({
            clinicianId: cId
        }, {
            givenName: true,
            familyName: true,
            dateOfBirth: true,
            diabeteType: true,
            gender: true
        }).lean()
        var totalPatient = allPatient.length
        for (let i = 0; i < totalPatient; i++) {
            allPatient[i]['age'] = utility.getAge(allPatient[i].dateOfBirth)
        }
        console.log(allPatient)
        res.render('my-patient', {
            title: 'My Patients',
            patients: allPatient,
            total: totalPatient,
            query: saveQuery,
            layout: 'clinician-main',
            doctor: {
                givenName: 'Chris',
                familyName: "Smith"
            }
        })
    } catch (err) {
        console.log(err)
    }
}

const searchPatient = async(req, res) => {
    console.log(req.body)
    var query = {}
    var saveQuery = {}

    if (req.body.pname !== '') {
        var reg = new RegExp(req.body.pname, "i")
        query['$or'] = [{
            'givenName': reg
        }, {
            'familyName': reg
        }]
        saveQuery['nameExist'] = true
        saveQuery['pname'] = req.body.pname
    }

    if (req.body.diabeteType) {
        if (req.body.diabeteType !== 'All Types') {
            query['diabeteType'] = req.body.diabeteType
            switch (req.body.diabeteType) {
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

    if (!req.body.male || !req.body.female) {
        if (req.body.male) {
            query["gender"] = "Male"
            saveQuery['male'] = true
        } else if (req.body.female) {
            query["gender"] = "Female"
            saveQuery['female'] = true
        }
    } else {
        saveQuery['male'] = true
        saveQuery['female'] = true
    }

    console.log(query)
    try {
        const result = await Patient.find(
            query, {
                givenName: true,
                familyName: true,
                dateOfBirth: true,
                diabeteType: true,
                gender: true
            }
        ).lean()
        var totalPatient = result.length
        for (let i = 0; i < totalPatient; i++) {
            result[i]['age'] = utility.getAge(result[i].dateOfBirth)
        }
        res.render('my-patient', {
            title: 'My Patients',
            patients: result,
            total: totalPatient,
            query: saveQuery,
            layout: 'clinician-main',
            doctor: {
                givenName: 'Chris',
                familyName: "Smith"
            }
        })
    } catch (err) {
        console.log(err)
    }
}

const getOnePatientPage = async(req, res) => {
    var cId = "625e240b01e5ce1b9ef808e9"

    try {
        const clinician = await Clinician.findById(
            cId
        ).lean()

        const patient = await Patient.findById(
            req.params.id
        ).lean()

        if (!clinician || !patient) {
            return res.sendStatus(404)
        }

        return res.render('clinician-patient-detail', {
            thisClinician: clinician,
            thisPatient: patient,
            layout: 'clinician-main'
        })

    } catch (err) {
        return next(err)
    }
}

const getSupportPage = async(req, res) => {
    var cId = "625e240b01e5ce1b9ef808e9"
    var when = moment(new Date()).format('D/M/YY H:mm:ss')

    try {
        const clinician = await Clinician.findById(
            cId
        ).lean()

        const patient = await Patient.findById(
            req.params.id
        ).lean()

        if (!clinician || !patient) {
            return res.sendStatus(404)
        }

        return res.render('clinician-addSupportMessage', {
            thisClinician: clinician,
            thisPatient: patient,
            time: when,
            layout: 'clinician-main'
        })

    } catch (err) {
        return next(err)
    }
}

const addSupport = async(req, res) => {
    var cID = "625e240b01e5ce1b9ef808e9"

    console.log(req.body)

    const newSupportMessage = new SupportMessage({
        patientId: req.params.id,
        clinicianId: cID,
        content: req.body.notes
    })

    try {
        await newSupportMessage.save()
        res.status(204).send()

    } catch {
        res.status(204).send("<script> alert('Update Fail');</script>")
    }
}

const getNotesPage = async(req, res) => {
    var cId = "625e240b01e5ce1b9ef808e9"
    var when = moment(new Date()).format('D/M/YY H:mm:ss')

    try {
        const clinician = await Clinician.findById(
            cId
        ).lean()

        const patient = await Patient.findById(
            req.params.id
        ).lean()

        if (!clinician || !patient) {
            return res.sendStatus(404)
        }

        return res.render('clinician-addNotes', {
            thisClinician: clinician,
            thisPatient: patient,
            time: when,
            layout: 'clinician-main'
        })

    } catch (err) {
        return next(err)
    }
}

const addNotes = async(req, res) => {
    var cID = "625e240b01e5ce1b9ef808e9"

    console.log(req.body)

    const newNote = new ClinicainNote({
        patientId: req.params.id,
        clinicianId: cID,
        content: req.body.notes
    })

    try {
        await newNote.save()
        res.status(204).send()

    } catch {
        res.status(204).send("<script> alert('Update Fail');</script>")
    }
}

const getTimeSeriesPage = async(req, res) => {
    console.log('GET getTimeSeriesPage')
    const pid = req.params.id
    try {
        const onePatient = await Patient.findOne({
            _id: pid
        }, {
            givenName: true,
            familyName: true,
            timeSeries: true
        }).lean()

        console.log(onePatient)

        res.render('edit-ts', {
            patient: onePatient,
            layout: 'clinician-main',
            doctor: {
                givenName: 'Chris',
                familyName: 'Smith'
            }
        })
    } catch {
        res.send('patient not found')
    }
}

const updateTimeSeries = async(req, res) => {
    var newTimeSeries = []
    for (let i = 0; i < 4; i++) {
        var lower = Number(req.body.lowerLimit[i])
        var upper = Number(req.body.upperLimit[i])
        if (lower > upper) {
            res.send("<script> alert('Invalid Input');\
            window.location.href='time-series'; </script>")
            return
        }
        var item = {
            logItem: req.body.itemName[i],
            lowerLimit: lower,
            upperLimit: upper,
        }
        if (req.body.hasOwnProperty('checkbox' + i)) {
            item['activated'] = true
        } else {
            item['activated'] = false
        }
        newTimeSeries.push(item)
    }
    console.log(newTimeSeries)
    try {
        await Patient.findByIdAndUpdate({ '_id': req.params.id }, { timeSeries: newTimeSeries })
        res.send("<script> alert('Update time-series successfully');\
            window.location.href='detail'; </script>")
    } catch {
        res.send("<script> alert('Update Fail');\
            window.location.href='time-series'; </script>")
    }
}

const getPatientDetail = async(req, res) => {
    var cId = "625e240b01e5ce1b9ef808e9"

    try {
        const clinician = await Clinician.findById(
            cId
        ).lean()

        const patient = await Patient.findById(
            req.params.id
        ).lean()

        patient.age = utility.getAge(patient.dateOfBirth)

        // Health Record
        HealthRecord.aggregate([{
            $group: {
                _id: "when",
                value: { $push: "$$ROOT" }
            },
        }])

        const healthRecord = await HealthRecord.find({
            patientId: req.params.id,
        }).lean()

        for (let j = 0; j < healthRecord.length; j++) {
            healthRecord[j].when = moment(healthRecord[j].when).format('D/M/YY')
        }

        console.log("Health Record:", healthRecord)

        // Support Message
        const supportMessage = await SupportMessage.find({
            patientId: req.params.id,
            clinicianId: cId
        }).lean()

        for (let j = 0; j < supportMessage.length; j++) {
            supportMessage[j].when = moment(supportMessage[j].when).format('D/M/YY H:mm:ss')
        }

        // Clinician Note
        const clinicanNote = await ClinicainNote.find({
            patientId: req.params.id,
            clinicianId: cId
        }).lean()

        for (let j = 0; j < clinicanNote.length; j++) {
            clinicanNote[j].when = moment(clinicanNote[j].when).format('D/M/YY H:mm:ss')
        }

        if (!clinician || !patient) {
            return res.sendStatus(404)
        }

        return res.render('clinician-patient-page', {
            thisClinician: clinician,
            thisPatient: patient,
            thisHealthRecord: healthRecord,
            thisSupportMessage: supportMessage,
            thisClinicianNote: clinicanNote,
            layout: "clinician-main"
        })

    } catch (err) {
        return next(err)
    }
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
    res.render('clinician-login', {
        layout: "login"
    })
}

const clinicianLogin = async(req, res) => {
    res.redirect("/clinician/home")
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
}