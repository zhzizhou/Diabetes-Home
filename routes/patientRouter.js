const express = require('express')
const patientRouter = express.Router()
const passport = require('passport')
const patientController = require('../controllers/patientController')

const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('login')
    }
    return next()
}

patientRouter.get('/login', patientController.getLoginPage)

// patient login
patientRouter.post('/login',
    passport.authenticate('patient', {
        successRedirect: 'home',
        failureRedirect: 'login',
        failureFlash: true
    })
)
// patient logout
patientRouter.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

//display the patient home page
patientRouter.get('/home', isAuthenticated, patientController.getHome)

//display the leaderboard page
patientRouter.get('/leaderboard',isAuthenticated, patientController.getLeaderboard)

//display patient's all log history
patientRouter.get('/history', patientController.getLogHistory)

//display one of the log page according to record item id
patientRouter.get('/log/:id', patientController.getLogPage)

//patient submit one of the record log
patientRouter.post('/log/:id', patientController.insertLog)

//display patient's profile page
patientRouter.get('/profile', patientController.getProfile)

//display patient's edit profile page
patientRouter.get('/edit', patientController.getEditPage)

//update patient's details
patientRouter.put('/edit', patientController.updateProfile)

//display patient's setting page
patientRouter.get('/settings', patientController.getSettings)

//update new settings
patientRouter.put('/settings', patientController.updateSettings)


module.exports = patientRouter