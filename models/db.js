<<<<<<< HEAD
=======
// Load envioronment variables
>>>>>>> 09c8b5a1c6eff74d4b05779c84f64474cf0af7cb
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

<<<<<<< HEAD
=======

>>>>>>> 09c8b5a1c6eff74d4b05779c84f64474cf0af7cb
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
<<<<<<< HEAD
        dbName: 'DiabetesHome',
=======
        dbName: 'DiabetesHomeDB',
>>>>>>> 09c8b5a1c6eff74d4b05779c84f64474cf0af7cb
    })
    // Exit on error
const db = mongoose.connection.on('error', (err) => {
    console.error(err)
    process.exit(1)
})

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', async() => {
    console.log('Mongo connection started on ' + db.host + ':' + db.port)
})



require('./patient')
require('./clinician')
require('./logItem')
require('./timeSeries')
require('./healthRecord')
require('./support')
require('./notes')