const mongoose = require("mongoose")
const Schema = mongoose.Schema

const replySchema = new Schema(
  {
    comment: String,
    repliedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    replies: [
      {
        content: String,
        repliedBy: {
          type: Schema.Types.ObjectId,
          ref: "User"
        }
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model("Reply", replySchema)
