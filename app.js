// Import express
const express = require('express')
const exphbs = require('express-handlebars')
const clinicianRouter = require('./routes/clinicianRouter')
const patientRouter = require('./routes/patientRouter')
const app = express()

app.use(express.static('public')) 
app.use(express.json())     
app.use(express.urlencoded())  
app.engine('hbs', exphbs.engine({ 
    defaultlayout: 'main',
    extname: 'hbs'
}))

app.set('view engine', 'hbs')

//display index page
app.get('/', (req,res) => {
    res.send('GET index page')
})

//display about page
app.get('/about', (req,res) => {
    res.send('GET about page')
})

app.use((req,res,next) => {
    console.log('message arrived: ' + req.method + ' ' + req.path)
    next()
})

app.use('/patient', patientRouter)
app.use('/clinician', clinicianRouter)

app.listen(3000, () => {
    console.log('Demo app is listening on port 3000!')
})
