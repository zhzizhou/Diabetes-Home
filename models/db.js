<<<<<<< HEAD
// Load envioronment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'DiabetesHome',
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
require('./healthRecord')
require('./support')
=======
// Load envioronment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'DiabetesHome',
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
require('./healthRecord')
require('./support')
>>>>>>> 318b528ff5ed3d314a69b40c7eb31409b8b1f378
require('./notes')