const express = require("express")
const router = express.Router()
const User = require("../models/user_model")
const Tweet = require("../models/tweet_model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const protectedRoute = require("../middleware/protectedRoute")

const { storage } = require("../cloudinary")
const multer = require("multer")
const upload = multer({ storage })

//register
router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, username, password } = req.body
    if (!name || !email || !username || !password) {
      return res
        .status(400)
        .json({ error: "One or more mandatory fields are empty" })
    }

    const emailInDB = await User.findOne({ email })
    if (emailInDB) {
      return res.status(400).json({ error: "This email is already registered" })
    }

    const usernameInDB = await User.findOne({ username })
    if (usernameInDB) {
      return res.status(400).json({ error: "Username is already taken" })
    }

    const hashedPassword = await bcrypt.hash(password, 16)

    const user = new User({
      name,
      email,
      username,
      password: hashedPassword
    })
    await user.save()
    return res.status(201).json({ result: "User created successfully" })
  } catch (error) {
    console.error("Register Error", error)
  }
})

//login
router.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: "One or more mandatory are empty" })
    }

    const userInDB = await User.findOne({ username })
    if (!userInDB) {
      return res.status(400).json({ error: "Invalid credentials" })
    }
    const didMatch = await bcrypt.compare(password, userInDB.password)

    if (didMatch) {
      const jwtToken = jwt.sign({ _id: userInDB._id }, process.env.JWT_SECRET)
      const userInfo = {
        email: userInDB.email,
        username: userInDB.username,
        name: userInDB.name,
        _id: userInDB._id
      }
      return res
        .status(200)
        .json({ result: { token: jwtToken, user: userInfo } })
    }
  } catch (error) {
    console.log("Login error", error)
  }
})

//single user datail
router.get("/auth/user/:id", async (req, res) => {
  try {
    const { id } = req.params
    const result = await User.findById(id)
      .populate("followers", "_id")
      .populate("following", "_id")
    res.send(200).json({ result })
  } catch (error) {
    console.log("Single detail error", error)
  }
})

//follow user
router.put("/auth/user/:id/follow", protectedRoute, async (req, res) => {
  try {
    const { id } = req.params
    await User.updateOne({ _id: id }, { $push: { followers: req.user._id } })
    await User.updateOne({ _id: req.user._id }, { $push: { following: id } })
    res.status(200).json({ result: "Updated successfully" })
  } catch (error) {
    console.log("Follow error", error)
  }
})

//unfollow user
router.put("/auth/user/:id/unfollow", protectedRoute, async (req, res) => {
  try {
    const { id } = req.params
    await User.updateOne({ _id: id }, { $pull: { followers: req.user._id } })
    await User.updateOne({ _id: req.user._id }, { $pull: { following: id } })
    res.status(200).json({ result: "Updated successfully" })
  } catch (error) {
    console.log("Unfollow error", error)
  }
})

//edit user details
router.put("/user/edit", protectedRoute, async (req, res) => {
  try {
    const { name, dob, location } = req.body
    await User.updateOne({ _id: req.user._id }, { name, dob, location })
    res.status(200).json({ result: "Updated succesfully" })
  } catch (error) {
    console.log("Edit user error", error)
  }
})

//get user tweets
router.post("/user/:id/tweets", protectedRoute, async (req, res) => {
  try {
    const userTweets = await Tweet.find({ tweetedBy: id })
    res.status(200).json({ result: userTweets })
  } catch (error) {
    console.log("User tweets error", error)
  }
})

//upload profile picture
router.post(
  "/user/:id/uploadProfilePic",
  upload.single("image"),
  protectedRoute,
  async (req, res) => {
    try {
      const picture = {
        url: req.file.path,
        filename: req.file.filename
      }
      await User.updateOne({ _id: req.user._id }, { picture })
      res.status(200).json({ result: "Profie picture updated sccessfully" })
    } catch (error) {
      console.log("Upload picture error", error)
    }
  }
)

//Tweeet Route

//create tweet
router.post(
  "/api/tweet",
  upload.single("image"),
  protectedRoute,
  async (req, res) => {
    try {
      const { content } = req.body
      if (req.file) {
        await Tweet.create({
          content,
          image: { url: req.file.path, filename: req.file.filename },
          tweetedBy: req.user._id
        })
        return res.status(200).json({ result: "Tweeted Successfully" })
      } else {
        await Tweet.create({ content, tweetedBy: req.user._id })
        return res.status(200).json({ result: "Tweeted Successfully" })
      }
    } catch (error) {
      console.log("create tweet error", error)
    }
  }
)

//like tweet
router.put("/tweet/:id/like", protectedRoute, async (req, res) => {
  try {
    const { id } = req.params
    await Tweet.updateOne({ _id: id }, { $addToSet: { likes: req.user._id } })
    res.status(200).json({ result: "Liked" })
  } catch (error) {
    console.log("like tweet error", error)
  }
})

//dislike tweet
router.put("/tweet/:id/dislike", protectedRoute, async (req, res) => {
  try {
    const { id } = req.params
    await Tweet.updateOne({ _id: id }, { $pull: { likes: req.user._id } })
    res.status(200).json({ result: "Disliked" })
  } catch (error) {
    console.log("like tweet error", error)
  }
})

//reply
router.post("/api/tweet/:id/reply", protectedRoute, async (req, res) => {
  try {
    const { id } = req.params
    const { content } = req.body
    const newTweet = await Tweet.create({ content, tweetedBy: req.user._id })
    await Tweet.updateOne({ _id: id }, { $push: { replies: newTweet._id } })
    res.status(200).json({ result: "replied successfully" })
  } catch (error) {
    console.log("Reply error", error)
  }
})

//single tweet detail
router.get("/tweet/:id", async (req, res) => {
  try {
    const { id } = req.params
    const tweetDetail = await Tweet.findById(id)
      .populate("tweetedBy")
      .populate("likes")
      .populate("retweetBy")
      .populate("replies")
    res.status(200).json({ result: tweetDetail })
  } catch (error) {
    console.log("Single tweet detail error", error)
  }
})

//all tweet details
router.get("/tweet", async (req, res) => {
  try {
    const tweets = await Tweet.find({}).sort({ createdAt: -1 })
    res.status(200).json({ result: tweets })
  } catch (error) {
    console.log("All tweet detail error", error)
  }
})

//delete tweet
router.delete("/tweet/:id", protectedRoute, async (req, res) => {
  try {
    const { id } = req.params
    const tweetToBeDeleted = await Tweet.findById(id)
    if (req.user._id.equals(tweetToBeDeleted.tweetedBy)) {
      await Tweet.findByIdAndDelete(id)
      res.status(200).json({ result: "Deleted Sucessfully" })
    } else {
      res
        .status(401)
        .json({ result: "You are not authorized to delete this tweet" })
    }
  } catch (error) {
    console.log("Delete tweet error", error)
  }
})

//retweet
router.post("/tweet/:id/retweet", protectedRoute, async (req, res) => {
  try {
    const { id } = req.params
    const retweet = await Tweet.updateOne(
      { _id: id },
      { $addToSet: { retweetBy: req.user._id } }
    )
    retweet
      ? res.status(200).json({ result: "retweeted Sucessfully" })
      : res.status(301).json({ result: "User already retweeted" })
  } catch (error) {
    console.log("Retweet Error", error)
  }
})

module.exports = router
