const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/DiabetesHome',{ 
  useNewUrlParser: true,
  dbName: "DiabetesHome"
});
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






