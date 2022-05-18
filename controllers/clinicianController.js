const Clinician = require('../models/clinician')
const Patient = require('../models/patient')
const HealthRecord = require('../models/healthRecord')
const SupportMessage = require('../models/supportMessage')
const clinicianNote = require('../models/clinicianNote')
const { validationResult } = require('express-validator');
const utility = require('../utils/utils')
const moment = require('moment')
const {
    format
} = require('express/lib/response')
const {
    body
} = require('express-validator')

const getHome = async(req, res) => {
    var cId = req.user._id
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
            title: "Dashboard",
            layout: 'clinician-main',
            doctor: {
                familyName: req.user.familyName,
                givenName: req.user.givenName
            }
        })
    } catch (err) {
        console.log(err)
    }
}

const getProfile = async(req, res) => {
    try {
        const clinician = await Clinician.findById(
            req.user._id
        ).lean()

        if (!clinician) {
            return res.sendStatus(404)
        }
        //found clinician
        return res.render('clinician-profile', {
            thisClinician: clinician,
            title: "Profile",
            layout: "clinician-add-new-patient"
        })

    } catch (err) {
        return next(err)
    }
}

const getSettings = async(req, res) => {
    try {
        const clinician = await Clinician.findById(
            // req.params.clinician_id
            '625e240b01e5ce1b9ef808e9'
        ).lean()

        if (!clinician) {
            return res.sendStatus(404)
        }
        //found clinician
        return res.render('clinician-setting', {
            layout: "clinician-main"
        })

    } catch (err) {
        return next(err)
    }
}

const registerClinician = async(req, res) => {
    console.log(req.body)
    try {
        const newClinician = new Clinician({
            givenName: req.body.givenName,
            familyName: req.body.familyName,
            password: req.body.password,
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
    try {
        return res.render('clinician-add-new-patient', {
            doctor: {
                familyName: req.user.familyName,
                givenName: req.user.givenName
            },
            title: "Add new patient",
            layout: "clinician-add-new-patient"
        })

    } catch (err) {
        return next(err)
    }
}

const addNewPatient = async(req, res) => {
    var clinicianId = req.user._id

    console.log(req)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
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
            password: req.body.password,
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

        await newPatient.save()
        res.send("<script> alert('Add new patient successfully');\
                window.location.href='home'; </script>")

    } catch (err) {
        res.send("<script> alert('add new patient Fail');\
        window.location.href='home'; </script>")
    }
}

const getMyPatientPage = async(req, res) => {
    var cId = req.user._id
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
        res.render('my-patient', {
            title: 'My Patients',
            patients: allPatient,
            total: totalPatient,
            query: saveQuery,
            layout: 'clinician-main',
            doctor: {
                familyName: req.user.familyName,
                givenName: req.user.givenName
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
        const clinician = await Clinician.findById(req.user._id).lean()
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
            doctor: clinician
        })
    } catch (err) {
        console.log(err)
    }
}

const getOnePatientPage = async(req, res) => {

    try {
        const patient = await Patient.findById(
            req.params.id
        ).lean()

        if (!patient) {
            return res.sendStatus(404)
        }

        return res.render('clinician-patient-detail', {
            thisClinician: {
                familyName: req.user.familyName,
                givenName: req.user.givenName
            },
            thisPatient: patient,
            title: "Patient Detail",
            layout: 'clinician-main'
        })

    } catch (err) {
        return next(err)
    }
}

const getSupportPage = async(req, res) => {

    var when = moment(new Date()).format('D/M/YY H:mm:ss')

    try {
        const patient = await Patient.findById(
            req.params.id
        ).lean()

        if (!patient) {
            return res.sendStatus(404)
        }

        return res.render('clinician-addSupportMessage', {
            thisClinician: {
                familyName: req.user.familyName,
                givenName: req.user.givenName
            },
            thisPatient: patient,
            time: when,
            title: "Add Support Message",
            layout: 'clinician-main'
        })

    } catch (err) {
        return next(err)
    }
}

const addSupport = async(req, res) => {
    var cID = req.user._id

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

    var when = moment(new Date()).format('D/M/YY H:mm:ss')

    try {
        const patient = await Patient.findById(
            req.params.id
        ).lean()

        if (!patient) {
            return res.sendStatus(404)
        }

        return res.render('clinician-addNotes', {
            thisClinician: {
                familyName: req.user.familyName,
                givenName: req.user.givenName
            },
            thisPatient: patient,
            time: when,
            title: "Add Clinician Notes",
            layout: 'clinician-main'
        })

    } catch (err) {
        return next(err)
    }
}

const addNotes = async(req, res) => {
    var cId = req.user._id

    console.log(req.body)

    const newNote = new clinicianNote({
        patientId: req.params.id,
        clinicianId: cId,
        content: req.body.notes
    })

    try {
        await newNote.save()
        res.send("<script> alert('Added Note successfully');\
            window.location.href='detail'; </script>")

    } catch {
        res.send("<script> alert('add note Fail');\
        window.location.href='detail'; </script>")
    }
}

const getAllClinicianNotes = async(req, res) => {
    try {
        const clinician = await Clinician.findById(req.user._id).lean()
        const patient = await Patient.findById(req.params.id).lean()
        const notes = await clinicianNote.find({
            patientId: req.params.id,
            clinicianId: req.user._id,
        }).lean()

        for (let j = 0; j < notes.length; j++) {
            notes[j].when = moment(notes[j].when).format('D/M/YY H:mm:ss')
        }

        return res.render('clinician-all-notes', {
            patient: patient,
            clinician: clinician,
            note: notes,
            title: 'Notes',
            layout: "clinician-main"
        })

    } catch (err) {
        res.send(err)
    }
}

const getTimeSeriesPage = async(req, res) => {
    const pid = req.params.id
    try {
        const onePatient = await Patient.findOne({
            _id: pid
        }, {
            givenName: true,
            familyName: true,
            timeSeries: true
        }).lean()

        res.render('edit-ts', {
            patient: onePatient,
            title: "Edit Time Series",
            layout: 'clinician-main',
            doctor: {
                familyName: req.user.familyName,
                givenName: req.user.givenName
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
        await Patient.findByIdAndUpdate({
            '_id': req.params.id
        }, {
            timeSeries: newTimeSeries
        })
        res.send("<script> alert('Update time-series successfully');\
            window.location.href='detail'; </script>")
    } catch {
        res.send("<script> alert('Update Fail');\
            window.location.href='time-series'; </script>")
    }
}

const getPatientDetail = async(req, res) => {
    try {
        var dateQuery = {}
        var saveQuery = {}
        console.log(req.query)

        if (Object.keys(req.query).length === 0) {

            saveQuery['startDate'] = moment().subtract(7, 'd').format('YYYY-MM-DD')
            dateQuery['$gte'] = new Date(saveQuery['startDate'])
            saveQuery['endDate'] = moment().format('YYYY-MM-DD')

        } else {
            saveQuery['startDate'] = req.query.start
            saveQuery['endDate'] = req.query.end

            var start = new Date(req.query.start)
            var end = moment(new Date(req.query.end)).add(1, 'd').toDate()
            dateQuery['$gte'] = start
            dateQuery['$lt'] = end
        }

        const patient = await Patient.findById(req.params.id).lean()
        patient.age = utility.getAge(patient.dateOfBirth)
            //search all health record group by date in descending order
        var healthRecord = await HealthRecord.aggregate([{
            $match: {
                patientId: patient._id,
                when: dateQuery
            }
        }, {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%d/%m",
                        date: "$when"
                    }
                },
                list: {
                    $push: {
                        item: "$logItemId",
                        value: "$value"
                    }
                },
                count: {
                    $sum: 1
                }
            }
        }, {
            $sort: {
                _id: -1
            }
        }])

        //fill the empty items
        for (let i = 0; i < healthRecord.length; i++) {

            healthRecord[i].list.sort((x, y) => {
                return x.item - y.item
            })
            var preFormat = [{}, {}, {}, {}]

            for (let j = 0; j < healthRecord[i].list.length; j++) {

                var currentRecord = healthRecord[i].list[j]
                var pos = currentRecord.item - 1
                var val = currentRecord.value
                preFormat[pos] = healthRecord[i].list[j]

                if (val > patient.timeSeries[pos].upperLimit ||
                    val < patient.timeSeries[pos].lowerLimit) {
                    preFormat[pos]['alert'] = true
                }
            }
            healthRecord[i].list = preFormat
        }
        // find latest support message
        const supports = await SupportMessage.find({
            patientId: req.params.id,
            clinicianId: req.user._id,
        }).sort({
            when: -1
        }).limit(2).lean()

        for (let j = 0; j < supports.length; j++) {
            supports[j].when = moment(supports[j].when).format('D/M/YY H:mm:ss')
        }

        // find latest clinician note
        const notes = await clinicianNote.find({
            patientId: req.params.id,
            clinicianId: req.user._id,
        }).sort({
            when: -1
        }).limit(1).lean()

        for (let j = 0; j < notes.length; j++) {
            notes[j].when = moment(notes[j].when).format('D/M/YY H:mm:ss')
        }

        return res.render('clinician-patient-page', {
            patient: patient,
            healthRecord: healthRecord,
            support: supports,
            note: notes,
            title: 'My Patient Detail',
            date: saveQuery,
            doctor: {
                familyName: req.user.familyName,
                givenName: req.user.givenName
            },
            layout: "clinician-main"
        })
    } catch (err) {
        res.send(err)
    }
}

const getLoginPage = async(req, res) => {
    res.render('clinician-login', {
        flash: req.flash('error'),
        title: "Clinician login",
        layout: "login"
    })
}

const clinicianLogin = async(req, res) => {
    res.redirect("/clinician/home")
}

module.exports = {
    getHome,
    getProfile,
    getSettings,
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
    getLoginPage,
    clinicianLogin,
    getAllClinicianNotes
}