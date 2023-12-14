const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    name: String,
    username: String,
    email: String,
    password: String,
    picture: String,
    location: String,
    dob: Date,
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)
