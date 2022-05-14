const express = require('express')
const clinicianRouter = express.Router()
const passport = require('passport')
const clinicianController = require('../controllers/clinicianController')

const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('login')
    }
    if(req.user.clinicianId !== undefined){
        return res.redirect('login')
    }
    return next()
}

clinicianRouter.get('/login', clinicianController.getLoginPage)

// clinician login
clinicianRouter.post('/login',
        passport.authenticate('clinician', {
            successRedirect: 'home',
            failureRedirect: 'login',
            failureFlash: true
        })
    )
    // clinician logout
clinicianRouter.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

//display the patient home page
clinicianRouter.get('/home', isAuthenticated, clinicianController.getHome)

//display clinician's profile page
clinicianRouter.get('/profile', isAuthenticated, clinicianController.getProfile)

//display clinician's edit profile page
clinicianRouter.get('/edit', clinicianController.getEditPage)

//update clinician's profile
clinicianRouter.put('/edit', clinicianController.updateProfile)

//display clinician's setting page
clinicianRouter.get('/settings', clinicianController.getSettings)

//update clinician's new settings
clinicianRouter.put('/settings', clinicianController.updateSettings)

//display clinician's register page
clinicianRouter.get('/register', clinicianController.getRegisterPage)

//add a new clinician
clinicianRouter.post('/register', clinicianController.registerClinician)

//display add patient page
clinicianRouter.get('/new-patient', isAuthenticated, clinicianController.getNewPatientPage)

//add a new patient
clinicianRouter.post('/new-patient', isAuthenticated, clinicianController.addNewPatient)

//display my patient page
clinicianRouter.get('/my-patient', isAuthenticated, clinicianController.getMyPatientPage)

//search for patients based on filter
clinicianRouter.post('/my-patient', isAuthenticated, clinicianController.searchPatient)

//display a specific patient
clinicianRouter.get('/my-patient/:id', isAuthenticated, clinicianController.getOnePatientPage)

//display support page
clinicianRouter.get(
    '/my-patient/:id/support',
    isAuthenticated,
    clinicianController.getSupportPage
)

//add support to a specific patient
clinicianRouter.post('/my-patient/:id/support', isAuthenticated, clinicianController.addSupport)

//display notes page
clinicianRouter.get('/my-patient/:id/notes', isAuthenticated, clinicianController.getNotesPage)

//update notes to a specific patient
clinicianRouter.post('/my-patient/:id/notes', isAuthenticated, clinicianController.addNotes)

//display patient's time-series page
clinicianRouter.get(
    '/my-patient/:id/time-series',
    isAuthenticated,
    clinicianController.getTimeSeriesPage
)

//update a patient's time-series
clinicianRouter.post(
    '/my-patient/:id/time-series',
    clinicianController.updateTimeSeries
)

//display a patient's detail
clinicianRouter.get(
    '/my-patient/:id/detail',
    isAuthenticated,
    clinicianController.getPatientDetail
)

//display edit patient page
clinicianRouter.get(
    '/my-patient/:id/edit',
    clinicianController.getEditPatientPage
)

//update a patient's detail
clinicianRouter.put(
    '/my-patient/:id/edit',
    isAuthenticated,
    clinicianController.updatePatientDetail
)

/*//display clinician log in page
clinicianRouter.get('/login', clinicianController.getLoginPage)

//clician login request
clinicianRouter.post('/login', clinicianController.clinicianLogin)*/


module.exports = clinicianRouter