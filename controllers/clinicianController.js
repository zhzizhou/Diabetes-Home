const getHome = async (req, res) => {
    res.send('GET Home')
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

const getRegisterPage = async (req, res) => {
    res.send('GET RegisterPage')
    //TODO
}

const registerClinician = async (req, res) => {
    res.send('POST registerClinician')
    //TODO
}

const getNewPatientPage = async (req, res) => {
    res.send('GET NewPatientPage')
    //TODO
}

const addNewPatient = async (req, res) => {
    res.send('POST NewPatient')
    //TODO
}

const getMyPatientPage = async (req, res) => {
    res.send('GET MyPatientPage')
    //TODO
}

const searchPatient = async (req, res) => {
    res.send('POST searchPatient')
    //TODO
}

const getOnePatientPage = async (req, res) => {
    res.send('GET OnePatientPage')
    //TODO
}

const getSupportPage = async (req, res) => {
    res.send('GET SupportPage')
    //TODO
}

const addSupport = async (req, res) => {
    res.send('POST addSupport')
    //TODO
}

const getNotesPage = async (req, res) => {
    res.send('GET NotesPage')
    //TODO
}


const addNotes = async (req, res) => {
    res.send('POST addNotes')
    //TODO
}

const getTimeSeriesPage = async (req, res) => {
    res.send('GET getTimeSeriesPage')
    //TODO
}

const updateTimeSeries = async (req, res) => {
    res.send('PUT updateTimeSeries')
    //TODO
}

const getPatientDetail = async (req, res) => {
    res.send('GET PatientDetail')
    //TODO
}

const getEditPatientPage = async (req, res) => {
    res.send('GET EditPatientPage')
    //TODO
}

const updatePatientDetail = async (req, res) => {
    res.send('POST updatePatientDetail')
    //TODO
}

const getLoginPage = async (req, res) => {
    res.send('GET LoginPage')
    //TODO
}

const clinicianLogin = async (req, res) => {
    res.send('POST clinicianLogin')
    //TODO
}



module.exports = {getHome,getProfile, getEditPage, updateProfile, getSettings, updateSettings,
    getRegisterPage, registerClinician, getNewPatientPage, addNewPatient, getMyPatientPage,
    searchPatient, getOnePatientPage, getSupportPage, addSupport, getNotesPage, addNotes, 
    getTimeSeriesPage, updateTimeSeries, getPatientDetail, getEditPatientPage, updatePatientDetail, 
    getLoginPage, clinicianLogin}