const userService = require("../services/userService");
const { User } = require("../models/User");


async function saveUser(req, res) {
  try {
    const username = req.params.username;
    const userDetails = await userService.saveUser(username);
    console.log("5tvy6b6yb6yb6y", userDetails);
    if (!userDetails) {
      res.status(200).json({ message: "User alerady exists" });
    } else {
      res.status(201).json({ message: "User created sucessfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function findMutualFollowers(req, res) {
  try {
    const username = req.params.username;
    const savedUser = await userService.findMutualFollowers(username);
    if (savedUser) {
      res.status(200).json({ savedUser });
    } else {
      res.status(404).json({ message: "savedUser not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  saveUser,
  findMutualFollowers,
};
