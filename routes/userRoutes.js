const { User } = require("../models/User");

const express = require("express");
const router = express.Router();

router.get("/save-user/:username", async (req, res) => {
  const username = req.params.username;

  const userExists = await User.findOne({ userName: username });
  console.log(userExists)
  if (userExists) {
    res.status(200).json({ message: "User alerady exists" });
  } else {
    let response = await fetch(`https://api.github.com/users/${username}`);
    response = await response.json();
    response.userName = username;
    const user = new User(response);
    const userDetails = await user.save();
    console.log(userDetails);
    res.status(201).json({ userDetails });
  }
});

module.exports = router;
