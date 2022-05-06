const passport = require('passport')
const LocalStrategy = require('passport-local')
const Clinician = require('./models/clinician')
const Patient = require('./models/patient')

passport.serializeUser((user, done) => {
    done(undefined, user._id)
})

passport.deserializeUser((userId, done) => {
    var user = null
    try {
        user = Clinician.findById(userId, {
            password: 0
        })
        if (!user) {
            user = Patient.findById(userId, {
                password: 0
            })
        }

    } catch (err) {
        return done(err, undefined)
    }
    return done(undefined, user)
})


passport.use('patient', new LocalStrategy((username, password, cb) => {

    Patient.findOne({
        email: username
    }, {}, {}, (err, user) => {
        if (err) {
            return cb(null, false, {
                message: 'Unknown error'
            })
        }
        if (!user) {
            return cb(null, false, {
                message: 'Incorrect username or password'
            })
        }

        user.verifyPassword(password, (err, valid) => {
            if (err) {
                return cb(null, false, {
                    message: 'Unknown error'
                })
            }
            if (!valid) {
                return cb(null, false, {
                    message: 'Incorrect username or password'
                })
            }
            return cb(null, user)
        })
    })
}))

passport.use('clinician', new LocalStrategy((username, password, cb) => {

    Clinician.findOne({
        email: username
    }, {}, {}, (err, user) => {
        if (err) {
            return cb(null, false, {
                message: 'Unknown error'
            })
        }
        if (!user) {
            return cb(null, false, {
                message: 'Incorrect username or password'
            })
        }

        user.verifyPassword(password, (err, valid) => {
            if (err) {
                return cb(null, false, {
                    message: 'Unknown error'
                })
            }
            if (!valid) {
                return cb(null, false, {
                    message: 'Incorrect username or password'
                })
            }
            return cb(null, user)
        })
    })
}))

module.exports = passport