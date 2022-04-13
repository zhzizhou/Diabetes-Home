require('dotenv').config()    // for database login details
const mongoose = require("mongoose")

if (process.env.PORT) {  // are we running on Heroku?
  // login details retrieved from environment variables
  connectionString = "mongodb+srv://<username>:<password>@cluster0.srimt.mongodb.net/mylibraryapp?retryWrites=true&w=majority"
  dbAddress = connectionString.replace("<username>",process.env.MONGO_USERNAME).replace("<password>",process.env.MONGO_PASSWORD)
} else {  // we are running locally
  dbAddress = "mongodb://localhost"
}

mongoose.connect( dbAddress, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  dbName: "DiabetesHome"
})

const db = mongoose.connection

db.on("error", err => {
  console.error(err);
  process.exit(1)
})

db.once("open", async () => {
  console.log("Mongo connection started on " + db.host + ":" + db.port)
})





