const mongoose = require('mongoose')
const HealthRecord = require('../models/healthRecord')
const Patient = require('../models/patient')
const Doctor = require('../models/clinician')
const moment = require('moment')
const bcrypt = require('bcrypt')
const supportMessage = require('../models/supportMessage')

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
            patientId: patient._id,
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
        const notes = await supportMessage.find({
            patientId: pID,
            clinicianId: patient.clinicianId
        }).sort({ when: -1 }).limit(1).lean()

        for (let j = 0; j < notes.length; j++) {
            notes[j].when = moment(notes[j].when).format('D/M/YY H:mm:ss')
        }
        console.log(notes[0])
            // get engagement rate

        var healthRecord = await HealthRecord.aggregate([{
            $match: { patientId: patient._id }
        }, {
            $group: {
                _id: { $dateToString: { format: "%d/%m", date: "$when", timezone: "Australia/Melbourne" } }
            }
        }])


        var now = moment()
        var registerDate = moment(patient.registerDate)
        var days = now.diff(registerDate, 'days') + 1
        var engageRate = Math.round(healthRecord.length / days * 100)
        console.log("healthrecord" + healthRecord.length)
        console.log("days:" + days)
        console.log("engegemtn" + engageRate)

        if (engageRate >= 80) {
            badge = "badge-filled"
        } else {
            badge = "badge"
        }


        // darkmode rendering 
        var colorlayout
        if (patient.darkMode == false) {
            //light colorscheme
            colorlayout = 'patient-main'
        } else {
            colorlayout = 'DARK-patient-main'
        }

        // render hbs page
        return res.render('patient-dashboard', {
            layout: colorlayout,
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
            note: notes[0],
            engagement: engageRate,
            helpers: {
                showbadge: function(engagement) {
                    if (engagement >= 80) {
                        return true
                    }
                    return false
                }
            }
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
                    _id: { $dateToString: { format: "%d/%m", date: "$when", timezone: "Australia/Melbourne" } }
                }
            }])
            var now = moment()
            var registerDate = moment(allPatient[i].registerDate)
            var days = now.diff(registerDate, 'days') + 1
            var engageRate = healthRecord.length / days * 100
            allPatient[i]['engagementRate'] = Math.round(engageRate)


            if (req.user._id.equals(allPatient[i]._id)) {
                allPatient[i].nickName = 'ME'
                allPatient[i].self = true
                myResult = allPatient[i]
            }
        }

        allPatient.sort((x, y) => { return y.engagementRate - x.engagementRate })
        var mypos = allPatient.indexOf(myResult)
        if (mypos >= 5) {
            myResult['rank'] = mypos
        }
        var topPatient = allPatient.slice(0, 5)

        var colorlayout
        const patient = await Patient.findById(req.user._id).lean()
        if (patient.darkMode == false) {
            //light colorscheme
            colorlayout = 'patient-main'
        } else {
            colorlayout = 'DARK-patient-main'
        }

        return res.render('patient-leaderboard', {
            self: myResult,
            top: topPatient,
            title: "Leaderboard",
            layout: colorlayout,
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
        var dateQuery = {}
        var saveQuery = {}
        console.log(req.query)

        if (Object.keys(req.query).length === 0) {

            saveQuery['startDate'] = moment().subtract(7, 'd').format('YYYY-MM-DD')
            dateQuery['$gte'] = new Date(saveQuery['startDate'])
            saveQuery['endDate'] = moment().format('YYYY-MM-DD')

        } else {
            saveQuery['startDate'] = req.query.start
            saveQuery['endDate'] = req.query.end

            var start = new Date(req.query.start)
            var end = moment(new Date(req.query.end)).add(1, 'd').toDate()
            dateQuery['$gte'] = start
            dateQuery['$lt'] = end
        }

        const patient = await Patient.findById(
            req.user._id
        ).lean()
        var healthRecord = await HealthRecord.aggregate([{
            $match: {
                patientId: patient._id,
                when: dateQuery
            }
        }, {
            $group: {
                _id: { $dateToString: { format: "%d/%m", date: "$when", timezone: "Australia/Melbourne" } },
                list: { $push: { item: "$logItemId", value: "$value", id: "$_id", time:{ $dateToString: { format: "%H:%M", date: "$when", timezone: "Australia/Melbourne"} }} },
                count: { $sum: 1 }
            }
        }, {
            $sort: { _id: -1 }
        }])

        if (!patient) {
            return res.sendStatus(404)
        }
        // color mode
        var colorlayout
        if (patient.darkMode == false) {
            //light colorscheme
            colorlayout = 'patient-main'
        } else {
            colorlayout = 'DARK-patient-main'
        }
        //found patient
        res.render('patient-log-history', {
            title: "Log History",
            layout: colorlayout,
            thisPatient: patient,
            healthRecord: healthRecord,
            date: saveQuery,
        })

    } catch (err) {
        return next(err)
    }
}

const viewLogHistory = async(req, res) => {
    try {
        if (req.params.id != '')
            logid = req.params.id

        const patient = await Patient.findById(
            req.user._id
        ).lean()

        const ObjectId = require('mongodb').ObjectId;

        const onehealthRecord = await HealthRecord.findOne({
            _id: ObjectId(logid),
            patientId: patient._id
        }).lean()

        const logTime = moment(onehealthRecord.when).format('D/M/YY H:mm:ss')

        if (!patient) {
            return res.sendStatus(404)
        }
        if (!onehealthRecord) {
            return res.sendStatus(404)
        }
        //found patient
        res.render('patient-view-hs', {
            title: "Log History",
            layout: "patient-main",
            thisPatient: patient,
            healthRecord: onehealthRecord,
            logTime: logTime
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
        //color scheme
        var colorlayout
        if (patient.darkMode == false) {
            //light colorscheme
            colorlayout = 'patient-main'
        } else {
            colorlayout = 'DARK-patient-main'
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
            layout: colorlayout
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


    const newHealthRecord = new HealthRecord({
        logItemId: req.params.id,
        patientId: req.user._id,
        value: req.body.value,
        notes: req.body.notes,
    })

    try {
        await newHealthRecord.save()
        res.send("<script> alert('Added heal record successfully');\
            window.location.href='../home'; </script>")

    } catch {
        res.send("<script> alert('Fail to add heal record');\
        window.location.href='../home'; </script>")
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

        var colorlayout
        if (patient.darkMode == false) {
            //light colorscheme
            colorlayout = 'patient-main'
        } else {
            colorlayout = 'DARK-patient-main'
        }
        //found patient
        return res.render('patient-profile', {
            thisPatient: patient,
            title: "Profile",
            layout: colorlayout
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
        // color mode
        var colorlayout
        if (patient.darkMode == false) {
            //light colorscheme
            colorlayout = 'patient-changepassword'
        } else {
            colorlayout = 'DARK-patient-changepassword'
        }
        return res.render('patient-change-psw', {
            layout: colorlayout,
            thisPatient: patient
        })
    } catch (err) {
        return next(err)
    }
}

const updatePassword = async(req, res) => {
    console.log(req.body);
    try {
        const salt = await bcrypt.genSalt(10)

        var thisPassword = await bcrypt.hash(req.body.newPassword, salt)

        await Patient.findByIdAndUpdate({ _id: req.user._id }, { password: thisPassword })
        res.send("<script> alert('Updated password');\
             window.location.href='profile'; </script>")
    } catch (err) {
        console.log(err)
        res.send("<script> alert('Update Fail');\
             window.location.href='profile'; </script>")
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
        var colorlayout
        if (patient.darkMode == false) {
            //light colorscheme
            colorlayout = 'patient-main'
        } else {
            colorlayout = 'DARK-patient-main'
        }
        return res.render('patient-change-nickname', {
            layout: colorlayout,
            thisPatient: patient
        })
    } catch (err) {
        return next(err)
    }
}

const updateNickname = async(req, res) => {
    console.log(req.body);
    try {
        await Patient.findByIdAndUpdate({ _id: req.user._id }, { nickName: req.body.newNickname })
        res.send("<script> alert('Updated');\
             window.location.href='profile'; </script>")
    } catch (err) {
        res.send("<script> alert('Update Fail');\
             window.location.href='profile'; </script>")
    }
}

const getSettings = async(req, res) => {
    // console.log("Inside get settings")
    try {
        const patient = await Patient.findById(
            req.user._id
        ).lean()

        if (!patient) {
            return res.sendStatus(404)
        }
        var colorlayout
        if (patient.darkMode == false) {
            //light colorscheme
            colorlayout = 'patient-changepassword'
        } else {
            colorlayout = 'DARK-patient-changepassword'
        }

        //found patient
        return res.render('patient-setting', {
            layout: colorlayout,
            thisTitle: "Settings",
            thisPatient: patient,
            icon: "bloodtype"
        })

    } catch (err) {
        return next(err)
    }
}


// change dark mode functionality
const updateSettings = async(req, res) => {

    var thisDarkMode
    try {
        if (req.body.colourTheme == 'dark') {
            thisDarkMode = true
        } else {
            thisDarkMode = false
        }

        await Patient.findByIdAndUpdate({ _id: req.user._id }, { darkMode: thisDarkMode })
        res.send("<script> alert('Updated successfully');\
                window.location.href='settings'; </script>")

    } catch (err) {
        res.send("<script> alert('Updat false');\
                window.location.href='settings'; </script>")
    }
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

const getHelpPageOne = async(req, res) => {
    const patient = await Patient.findById(req.user._id).lean()
    var colorlayout
    if (patient.darkMode == false) {
        colorlayout = 'help-pages'
    } else {
        colorlayout = 'DARK-help-pages'
    }
    res.render('help1', {
        flash: req.flash('error'),
        title: "Help",
        layout: colorlayout
    })
}

const getHelpPageTwo = async(req, res) => {
    const patient = await Patient.findById(req.user._id).lean()
    var colorlayout
    if (patient.darkMode == false) {
        colorlayout = 'help-pages'
    } else {
        colorlayout = 'DARK-help-pages'
    }
    res.render('help2', {
        flash: req.flash('error'),
        title: "Help",
        layout: colorlayout
    })
}

const getHelpPageThree = async(req, res) => {
    const patient = await Patient.findById(req.user._id).lean()
    var colorlayout
    if (patient.darkMode == false) {
        colorlayout = 'help-pages'
    } else {
        colorlayout = 'DARK-help-pages'
    }
    res.render('help3', {
        flash: req.flash('error'),
        title: "Help",
        layout: colorlayout
    })
}

const getHelpPageFour = async(req, res) => {
    const patient = await Patient.findById(req.user._id).lean()
    var colorlayout
    if (patient.darkMode == false) {
        colorlayout = 'help-pages'
    } else {
        colorlayout = 'DARK-help-pages'
    }
    res.render('help4', {
        flash: req.flash('error'),
        title: "Help",
        layout: colorlayout
    })

}

const getAboutpage = async(req, res) => {
    console.log("Inside get about page")
    try {
        const patient = await Patient.findById(
            req.user._id
        ).lean()

        if (!patient) {
            return res.sendStatus(404)
        }
        var colorlayout
        if (patient.darkMode == false) {
            colorlayout = 'index-main'
        } else {
            colorlayout = 'DARK-index-main'
        }

        return res.render('about-loggedin', {
            layout: colorlayout,
            title: "aboutPage",
            patient: patient
        })

    } catch (err) {
        return next(err)
    }
}

module.exports = {
    getHome,
    getLeaderboard,
    getLogHistory,
    viewLogHistory,
    getLogPage,
    insertLog,
    getProfile,
    getSettings,
    updateSettings,
    getLoginPage,
    patientLogin,
    getChangePassword,
    getChangeNickname,
    getHelpPageOne,
    getHelpPageTwo,
    getHelpPageThree,
    getHelpPageFour,
    updatePassword,
    updateNickname,
    getAboutpage
}