const express = require('express')
const patientRouter = express.Router()
const passport = require('passport')
const patientController = require('../controllers/patientController')

const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/patient/login')
    }
    if (req.user.clinicianId === undefined) {
        return res.redirect('/patient/login')
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
patientRouter.get('/leaderboard', isAuthenticated, patientController.getLeaderboard)

//display patient's all log history
patientRouter.get('/history', isAuthenticated, patientController.getLogHistory)

//display one of the log page according to record item id
patientRouter.get('/log/:id', isAuthenticated, patientController.getLogPage)

//patient submit one of the record log
patientRouter.post('/log/:id', isAuthenticated, patientController.insertLog)

//display patient's profile page
patientRouter.get('/profile', isAuthenticated, patientController.getProfile)

//display patient's setting page
patientRouter.get('/settings', isAuthenticated, patientController.getSettings)

//update new settings
patientRouter.post('/settings', isAuthenticated, patientController.updateSettings)

//display eidt patient's password
patientRouter.get('/changepassword', isAuthenticated, patientController.getChangePassword)

//update patient's password
patientRouter.post('/changepassword', isAuthenticated, patientController.updatePassword)

//update patient's nickname
patientRouter.get('/changenickname', isAuthenticated, patientController.getChangeNickname)

//update patient's password
patientRouter.post('/changenickname', isAuthenticated, patientController.updateNickname)

//patient's about page
patientRouter.get('/about', isAuthenticated, patientController.getAboutpage)
module.exports = patientRouter