const mongoose = require('mongoose')
const HealthRecord = require('../models/healthRecord')
const Patient = require('../models/patient')
const Doctor = require('../models/clinician')
const moment = require('moment')
const expressValidator = require('express-validator')
const clinicianNote = require('../models/clinicianNote')

const getHome = async(req, res) => {
    //return res.render("patient-dashboard")
    console.log("GET Patient Dashboard Home page")
    var pID = req.user._id
    var badge;

    try {
        // found hardcoded doctor and patient
        const patient = await Patient.findById(pID).lean()
        const doctor = await Doctor.findById(patient.clinicianId).lean()
        if (!patient || !doctor) {
            return res.sendStatus(404)
        }

        if (patient.engagementRate >= 80) {
            badge = "badge-filled"
        } else {
            badge = "badge"
        }

        var latestLog1 = null
        var latestLog2 = null
        var latestLog3 = null
        var latestLog4 = null
        var log1Time = null
        var log2Time = null
        var log3Time = null
        var log4Time = null

        var now = new Date()

        // retrive lastest healthRecord from the database and do implementation

        const allhealth = await HealthRecord.find({
            patientId: pID,
            when: {
                $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate())
            }
        }).lean()


        // current plan: reverse the records to find the lastest record
        // until i have a better approach, just keep it this way for now
        for (let i = allhealth.length - 1; i >= 0; i--) {
            if (latestLog1 == null && allhealth[i].logItemId == 1) {
                latestLog1 = allhealth[i]
                log1Time = moment(allhealth[i].when).format('D/M/YY H:mm:ss')
                continue
            }
            if (latestLog2 == null && allhealth[i].logItemId == 2) {
                latestLog2 = allhealth[i]
                log2Time = moment(allhealth[i].when).format('D/M/YY H:mm:ss')
                continue
            }
            if (latestLog3 == null && allhealth[i].logItemId == 3) {
                latestLog3 = allhealth[i]
                log3Time = moment(allhealth[i].when).format('D/M/YY H:mm:ss')
                continue
            }
            if (latestLog4 == null && allhealth[i].logItemId == 4) {
                latestLog4 = allhealth[i]
                log4Time = moment(allhealth[i].when).format('D/M/YY H:mm:ss')
                continue
            }
        }

        // latest support message
        const notes = await clinicianNote.find({
            patientId: pID,
            clinicianId: patient.clinicianId
        }).sort({ when: -1 }).limit(1).lean()

        for (let j = 0; j < notes.length; j++) {
            notes[j].when = moment(notes[j].when).format('D/M/YY H:mm:ss')
        }
        console.log(notes[0])

        // render hbs page
        return res.render('patient-dashboard', {
            layout: 'patient-main',
            title: "Dashboard",
            badge: badge,
            patient: patient,
            doctor: doctor,
            log1: latestLog1,
            log2: latestLog2,
            log3: latestLog3,
            log4: latestLog4,
            log1time: log1Time,
            log2time: log2Time,
            log3time: log3Time,
            log4time: log4Time,
            note: notes[0]
        })

    } catch (err) {
        console.log(err)
    }

}

const getLeaderboard = async(req, res) => {
    try {
        const allPatient = await Patient.find({}, {
            givenName: true,
            familyName: true,
            nickName: true,
            registerDate: true
        }).lean()

        var myResult = null

        for (let i = 0; i < allPatient.length; i++) {
            var healthRecord = await HealthRecord.aggregate([{
                $match: { patientId: allPatient[i]._id }
            }, {
                $group: {
                    _id: { $dateToString: { format: "%d/%m", date: "$when" } }
                }
            }])
            var now = moment()
            var registerDate = moment(allPatient[i].registerDate)
            var days = now.diff(registerDate, 'days') + 1
            var engageRate = healthRecord.length / days * 100
            allPatient[i]['engagementRate'] = Math.round(engageRate)


            if (req.user._id.equals(allPatient[i]._id)) {
                allPatient[i].nickName = 'ME'
                myResult = allPatient[i]
            }
        }

        allPatient.sort((x, y) => { return y.engagementRate - x.engagementRate })
        var mypos = allPatient.indexOf(myResult)
        if (mypos >= 5) {
            myResult['rank'] = mypos
        }
        var topPatient = allPatient.slice(0, 5)

        return res.render('patient-leaderboard', {
            self: myResult,
            top: topPatient,
            title: "Leaderboard",
            layout: "patient-main",
            helpers: {
                inc: function(value, options) {
                    return parseInt(value) + 1;
                }
            }
        })

    } catch (err) {
        console.log(err)
    }
}

const getLogHistory = async(req, res) => {
    try {
        const patient = await Patient.findById(
            req.user._id
        ).lean()

        if (!patient) {
            return res.sendStatus(404)
        }
        //found patient
        res.render('patient-log-history', {
            title: "Log History",
            layout: "patient-main",
            thisPatient: patient
        })

    } catch (err) {
        return next(err)
    }



}

const getLogPage = async(req, res) => {
    console.log('GET Patient LogPage')

    var pID = req.user._id

    var logName
    var logIcon
    var placeHolder
    var enterType

    var when = moment(new Date()).format('D/M/YY H:mm:ss')

    if (req.params.id != '') {
        switch (req.params.id) {
            case '1':
                logName = "Weight"
                logIcon = "scale"
                placeHolder = "Enter in Kg"
                enterType = "1"
                break
            case '2':
                logName = "Insulin Doses"
                logIcon = "vaccines"
                placeHolder = "Enter doses"
                enterType = "1"
                break
            case '3':
                logName = "Exercise"
                logIcon = "directions_run"
                placeHolder = "Enter steps"
                enterType = "1"
                break
            case '4':
                logName = "Blood Glucose Level"
                logIcon = "bloodtype"
                placeHolder = "Enter in nmol/L"
                enterType = "0.1"
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

        return res.render('patient-enter-hs', {
            thisPatient: patient,
            title: "Enter Log",
            thisTitle: logName,
            icon: logIcon,
            time: when,
            id: req.params.id,
            dataPlaceHolder: placeHolder,
            thisEnterType: enterType,
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

    var pID = req.user._id


    const newHealthRecord = new HealthRecord({
        logItemId: req.params.id,
        patientId: req.body.patientId,
        value: req.body.value,
        notes: req.body.notes,
    })

    try {
        await newHealthRecord.save()
        res.status(204).send()

    } catch {
        res.status(204).send("<script> alert('Update Fail');</script>")
    }
}

const getProfile = async(req, res) => {
    try {
        const patient = await Patient.findById(
            req.user._id
        ).lean()

        if (!patient) {
            return res.sendStatus(404)
        }
        //found patient
        return res.render('patient-profile', {
            thisPatient: patient,
            title: "Profile",
            layout: "patient-main"
        })

    } catch (err) {
        return next(err)
    }
}
const getChangePassword = async(req, res) => {
    console.log("inside the change password page")

    try {
        const patient = await Patient.findById(
            req.user._id
        ).lean()

        if (!patient) {
            return res.sendStatus(404)
        }
        return res.render('patient-change-psw', {
            layout: 'patient-changepassword',
            thisPatient: patient
        })
    } catch (err) {
        return next(err)
    }
}

const getChangeNickname = async(req, res) => {
    console.log("inside the change nickname page")

    try {
        const patient = await Patient.findById(
            req.user._id
        ).lean()

        if (!patient) {
            return res.sendStatus(404)
        }
        return res.render('patient-change-nickname', {
            layout: 'patient-changepassword',
            thisPatient: patient
        })
    } catch (err) {
        return next(err)
    }
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
    console.log("Inside get settings")
    try {
        const patient = await Patient.findById(
            req.user._id
        ).lean()

        if (!patient) {
            return res.sendStatus(404)
        }
        //found patient
        return res.render('patient-setting', {
            layout: "patient-settingLayout",
            thisTitle: "Settings",
            patient: patient,
            icon: "bloodtype"
        })

    } catch (err) {
        return next(err)
    }
}

const updateSettings = async(req, res) => {
    res.send('PUT Settings')
        //TODO
}

const getLoginPage = async(req, res) => {
    res.render('patient-login', {
        flash: req.flash('error'),
        title: "Patient login",
        layout: "login"
    })
}


const patientLogin = async(req, res) => {
    res.redirect("/patient/home")
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
    getChangePassword,
    getChangeNickname
}