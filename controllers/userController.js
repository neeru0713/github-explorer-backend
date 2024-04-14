const userService = require("../services/userService");
const { User } = require("../models/User");

async function saveUser(req, res) {
  try {
    const username = req.params.username;
    const savedUserRes = await userService.saveUser(username);
    if (savedUserRes.success) {
      res.status(201).json(savedUserRes);
    } else {
      res.status(404).json(savedUserRes);
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

async function searchUsers(req, res) {
  try{
  const searchQueryKeys = Object.keys(req.query);

  const searchQuery = {};

  searchQueryKeys.forEach((item) => {
    const val = req.query[item];
    searchQuery[item] = val;
  });

  const searchResults = await userService.searchUsers(searchQuery);
  res.status(200).json({ users: searchResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
}
}


async function deleteUser(req, res) {
  try {
    const  username  = req.params.username;
    const deletedUser = await userService.deleteUser(username);
    res.status(200).json({ user: deletedUser });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: error.message });
  }
}


async function updateUser(req, res) {
  try {
    const username = req.params.username;
    const updates = req.body;
    const updatedUser = await userService.updateUser(username, updates);
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: error.message });
  }
}


async function listUsers(req, res) {
  try {
    const sortBy = req.query.sortBy;
    const users = await userService.listUsers(sortBy);
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  saveUser,
  findMutualFollowers,
  searchUsers,
  deleteUser,
  updateUser,
  listUsers
};
