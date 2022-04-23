const mongoose = require('mongoose')
const HealthRecord = require('../models/healthRecord')
const LogItem = require('../models/logItem')
const expressValidator = require('express-validator')

const getHome = async(req, res) => {
    res.send('GET Home')
        //TODO
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

    try {
        const logItem = await LogItem.findById(
            // req.params.logItemId
            // "625e240b01e5ce1b9ef808e9"
        ).lean()

        if (!logItem) {
            return res.sendStatus(404)
        }

        //found clinician
        return res.render('patient-enter-ts', {
            thisLogItem: logItem
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