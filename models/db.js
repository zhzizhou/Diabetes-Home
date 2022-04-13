const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/DiabetesHome',{ useNewUrlParser: true });
const db = mongoose.connection

db.on('error',console.error.bind(console,'connection error'))
db.once("open", async () => {
  console.log("Mongo connection started on " + db.host + ":" + db.port)
})

require('./patient')
require('./clinician')
require('./logItem')
require('./timeSeries')
require('./healthRecord')
require('./support')
require('./notes')






