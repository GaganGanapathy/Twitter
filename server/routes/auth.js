const express = require("express")
const router = express.Router()
const User = require("../models/user_model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

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
    return res.status(200).json({ result: "User created successfully" })
  } catch (error) {
    console.error("Register Error", error)
  }
})

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

module.exports = router
