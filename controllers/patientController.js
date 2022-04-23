const mongoose = require('mongoose')
const HealthRecord = require('../models/healthRecord')
const Patient = require('../models/patient')
const Doctor = require('../models/clinician')
const moment = require('moment')
const expressValidator = require('express-validator')

const getHome = async(req, res) => {
    //return res.render("patient-dashboard")
    console.log("GET Patient Dashboard Home page")
    var pID = "625e1e3d67c164c3d21e5bce" // Pat hardcoded
    var dID = "625e240b01e5ce1b9ef808e9" // doctor smith hardcoded

    try {
        const patient = await Patient.findById(pID).lean()
        const doctor = await Doctor.findById(dID).lean()
        if (!patient || !doctor) {
            return res.sendStatus(404)
        }


        //found patient
        return res.render('patient-dashboard', {
            layout: 'patient-main',
            patient: patient,
            doctor: doctor
        })

    } catch (err) {
        return next(err)
    }

}

const getLeaderboard = async(req, res) => {
    res.send('GET Leaderboard')
        //TODO
}

const getLogHistory = async(req, res) => {
    res.send('GET LogHistory')
        //TODO
}

const getLogPage = async(req, res) => {
    console.log('GET Patient LogPage')

    var pID = "625e1e3d67c164c3d21e5bce"

    var logName
    var logIcon
    var placeHolder
    var when = moment(new Date()).format('D/M/YY H:mm:ss')

    if (req.params.id != '') {
        switch (req.params.id) {
            case '1':
                logName = "Weight"
                logIcon = "scale"
                placeHolder = "Kg"
                break
            case '2':
                logName = "Insulin Doses"
                logIcon = "vaccines"
                placeHolder = "Number-of-doses"
                break
            case '3':
                logName = "Exercise"
                logIcon = "directions_run"
                placeHolder = "Steps"
                break
            case '4':
                logName = "Blood Glucose Level"
                logIcon = "bloodtype"
                placeHolder = "mmol/L"
                break
            default:
                return res.sendStatus(404)
        }
    } else {
        return res.sendStatus(404)
    }

    try {
        const patient = await Patient.findById(
            pID
        ).lean()

        if (!patient) {
            return res.sendStatus(404)
        }

        //found patient
        return res.render('patient-enter-hs', {
            thisPatient: patient,
            title: logName,
            icon: logIcon,
            time: when,
            dataPlaceHolder: placeHolder,
            layout: 'patient-main'
        })

    } catch (err) {
        return next(err)
    }
}

const insertLog = async(req, res) => {
    /**
     * patient/log/1 WEIGHT
     * patient/log/2 INSULIN DOSES
     * patient/log/3 EXERCISE
     * patient/log/4 BLOOD GLUCOSE LEVEL
     */
    console.log(req.body)
    console.log(req.params.id)
    const newHealthRecord = new HealthRecord({
        logItemId: req.params.id,
        patientId: req.body.patientId,
        value: req.body.value,
        notes: req.body.notes,
    })
    await newHealthRecord
        .save()
        .then((result) => res.send(result))
        .catch((err) => res.send(err))
}

const getProfile = async(req, res) => {
    res.send('GET Profile')
        //TODO
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

const getLoginPage = async(req, res) => {
    res.send('GET LoginPage')
        //TODO
}

const patientLogin = async(req, res) => {
    res.send('POST patientLogin')
        //TODO
}

module.exports = {
    getHome,
    getLeaderboard,
    getLogHistory,
    getLogPage,
    insertLog,
    getProfile,
    getEditPage,
    updateProfile,
    getSettings,
    updateSettings,
    getLoginPage,
    patientLogin,
}