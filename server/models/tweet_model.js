const mongoose = require("mongoose")
const Schema = mongoose.Schema

const tweetSchema = new Schema(
  {
    content: String,
    tweetedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    likes: [
      {
        types: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    retweetBy: [
      {
        types: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    image: String,
    replies: {
      type: Schema.Types.ObjectId,
      ref: "Tweet"
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Tweet", tweetSchema)
