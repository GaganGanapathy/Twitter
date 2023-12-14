const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

require("dotenv").config()

const auth = require("./routes/auth")

const app = express()
app.use(cors())
//recognizes the incoming request object as json object
app.use(express.json())
//recognizes the incoming request object as strings or arrays
app.use(express.urlencoded({ extended: false }))

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Connected")
  })
  .catch((error) => {
    console.log("Connection Error", error)
  })

app.use("/API", auth)

app.get("/", (req, res) => {
  res.send("working")
})

app.listen(process.env.PORT, () => {
  console.log("Listening")
})
