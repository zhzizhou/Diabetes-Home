// Import express
const express = require('express')
const app = express()
const flash = require('express-flash')
const session = require('express-session')
const exphbs = require('express-handlebars')
const clinicianRouter = require('./routes/clinicianRouter')
const patientRouter = require('./routes/patientRouter')

// connect to database
require('./models/db.js')

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.engine(
    'hbs',
    exphbs.engine({
        defaultlayout: 'main',
        extname: 'hbs',
        helpers: {
            have: x => x != "null"
        }
    })
)

app.set('view engine', 'hbs')
app.use(flash())
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        name: 'diabeteshome',
        saveUninitialized: false,
        resave: false,
        proxy: process.env.NODE_ENV === 'production', 
        cookie: {
            sameSite: 'strict',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 86400000
        },
    })
)

const passport = require('./passport')
app.use(passport.authenticate('session'))


//display index page
app.get('/', (req, res) => {
    res.render('index', {
        title: "DiabetesHome",
        layout: 'index-main'
    })
})

//display about page
app.get('/about', (req, res) => {
    res.render('about', {
        title: "about",
        layout: 'index-main'
    })
})

app.use((req, res, next) => {
    console.log('message arrived: ' + req.method + ' ' + req.path)
    next()
})

app.use('/patient', patientRouter)
app.use('/clinician', clinicianRouter)

app.all('*', (req, res) => {
    // 'default' route to catch user errors
    res.status(404).render('error', {
        errorCode: '404',
        message: 'That route is invalid.',
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log('DiabetesHome is running!')
})