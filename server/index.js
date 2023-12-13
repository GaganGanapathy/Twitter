const express = require("express")
const mongoose = require("mongoose")

const app = express()
app.use(cors())
//recognizes the incoming request object as json object
app.use(express.json())
//recognizes the incoming request object as strings or arrays
app.use(express.urlencoded())

mongoose
  .connect("mongodb://0.0.0.0:27017/")
  .then(() => {
    console.log("Connected")
  })
  .catch((error) => {
    console.log("Connection Error", error)
  })

app.get("/", (req, res) => {
  res.send("working")
})

app.listen("4000", () => {
  console.log("Listening")
})
