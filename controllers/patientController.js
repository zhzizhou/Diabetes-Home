const mongoose = require('mongoose')
const HealthRecord = require('../models/healthRecord')
const expressValidator = require('express-validator')


const getHome = async (req, res) => {
    res.send('GET Home')
    //TODO
}

const getLeaderboard = async (req, res) => {
    res.send('GET Leaderboard')
    //TODO
}

const getLogHistory = async (req, res) => {
    res.send('GET LogHistory')
    //TODO
}

const getLogPage = async (req, res) => {
    res.send('GET LogPage')
    //TODO
}


const insertLog = async (req, res) => {
    console.log(req.body);
    console.log(req.params.id)
    const newHealthRecord = new HealthRecord({
        logItemId: req.params.id,
        patientId: req.body.patientId,
        value: req.body.value,
        notes: req.body.notes
    })
    await newHealthRecord.save()
    .then((result)=>res.send(result))
    .catch((err)=>res.send(err))
}


const getProfile = async (req, res) => {
    res.send('GET Profile')
    //TODO
}

const getEditPage = async (req, res) => {
    res.send('GET EditPage')
    //TODO
}

const updateProfile = async (req, res) => {
    res.send('PUT updateProfile')
    //TODO
}

const getSettings = async (req, res) => {
    res.send('GET Settings')
    //TODO
}

const updateSettings = async (req, res) => {
    res.send('PUT Settings')
    //TODO
}

const getLoginPage = async (req, res) => {
    res.send('GET LoginPage')
    //TODO
}

const patientLogin = async (req, res) => {
    res.send('POST patientLogin')
    //TODO
}

module.exports = {getHome, getLeaderboard, getLogHistory, getLogPage, insertLog, 
    getProfile, getEditPage, updateProfile, getSettings, updateSettings, getLoginPage,patientLogin}