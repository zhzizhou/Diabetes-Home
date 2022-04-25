// Load envioronment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const mongoose = require('mongoose')

// if (process.env.PORT) { // are we running on Heroku?
//     // login details retrieved from environment variables
//     connectionString = "mongodb+srv://<username>:<password>@cluster0.lepap.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
//     dbAddress = connectionString.replace("<username>", process.env.MONGO_USERNAME).replace("<password>", process.env.MONGO_PASSWORD)

// } else { // we are running locally
//     dbAddress = "mongodb://localhost"
// }
// console.log(dbAddress);

// mongoose.connect(dbAddress, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     dbName: "DiabetesHome"
// })

// const db = mongoose.connection

// db.on("error", err => {
//     console.error(err);
//     process.exit(1)
// })

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
require('./notes')