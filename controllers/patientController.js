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
    res.send('POST insertLog')
    //TODO
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