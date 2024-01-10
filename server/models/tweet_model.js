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
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    retweetBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    image: {
      url: String,
      filename: String
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reply"
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model("Tweet", tweetSchema)
