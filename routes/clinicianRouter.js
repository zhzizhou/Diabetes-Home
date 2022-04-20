const express = require('express')
const clinicianRouter = express.Router()
const clinicianController = require('../controllers/clinicianController')

//display the patient home page
clinicianRouter.get('/home', clinicianController.getHome)

//display clinician's profile page
clinicianRouter.get('/profile', clinicianController.getProfile)
    //clinicianRouter.get('/:clinician_id', clinicianController.getProfile)

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
clinicianRouter.get('/new-patient', clinicianController.getNewPatientPage)

//add a new patient
clinicianRouter.post('/new-patient', clinicianController.addNewPatient)

//display my patient page
clinicianRouter.get('/my-patient', clinicianController.getMyPatientPage)

//search for patients based on filter
clinicianRouter.post('/my-patient', clinicianController.searchPatient)

//display a specific patient
clinicianRouter.get('/my-patient/:id', clinicianController.getOnePatientPage)

//display support page
clinicianRouter.get(
    '/my-patient/:id/support',
    clinicianController.getSupportPage
)

//add support to a specific patient
clinicianRouter.post('/my-patient/:id/support', clinicianController.addSupport)

//display notes page
clinicianRouter.get('/my-patient/:id/notes', clinicianController.getNotesPage)

//add notes to a specific patient
clinicianRouter.post('/my-patient/:id/notes', clinicianController.addNotes)

//display patient's time-series page
clinicianRouter.get(
    '/my-patient/:id/time-series',
    clinicianController.getTimeSeriesPage
)

//update a patient's time-series
clinicianRouter.put(
    '/my-patient/:id/time-series',
    clinicianController.updateTimeSeries
)

//display a patient's detail
clinicianRouter.get(
    '/my-patient/:id/detail',
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
    clinicianController.updatePatientDetail
)

//display clinician log in page
clinicianRouter.get('/login', clinicianController.getLoginPage)

//clician login request
clinicianRouter.post('/login', clinicianController.clinicianLogin)

module.exports = clinicianRouter