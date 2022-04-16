const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/DiabetesHome', {
    useNewUrlParser: true,
    dbName: 'diabetesAtHomeDB',
})
// Exit on error
const db = mongoose.connection.on('error', (err) => {
    console.error(err)
    process.exit(1)
})

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', async () => {
    console.log('Mongo connection started on ' + db.host + ':' + db.port)
})

require('./patient')
require('./clinician')
require('./logItem')
require('./timeSeries')
require('./healthRecord')
require('./support')
require('./notes')
