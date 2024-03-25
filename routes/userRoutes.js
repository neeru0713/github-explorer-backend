const { User } = require("../models/User");
const { GITHUB_TOKEN } = require("../config/config.js");
const express = require("express");
const router = express.Router();

router.get("/save-user/:username", async (req, res) => {
  const username = req.params.username;

  const userExists = await User.findOne({ username });
  console.log(userExists);
  if (userExists) {
    res.status(200).json({ message: "User alerady exists" });
  } else {
    let response = await fetch(`https://api.github.com/users/${username}`);
    response = await response.json();
    response.username = username;
    const user = new User(response);
    const userDetails = await user.save();
    console.log(userDetails);
    res.status(201).json({ userDetails });
  }
});

router.get("/find-mutual-followers/:username", async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ username });
  user.friends = [];
  let savedUser = user;
  await user.save();

  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
  };

  let response = await fetch(
    `https://api.github.com/users/${username}/followers`,
    { headers }
  );

  response = await response?.json();

  const promises = response?.map(async (item) => {
    const isFollowingRes = await fetch(
      `https://api.github.com/users/${username}/following/${item.login}`,
      { headers }
    );
    if (isFollowingRes.status === 204) {
      item.username = item.login;
      user.friends.push(item);
    } else if (isFollowingRes.status === 404) {
      user.friends = user.friends.filter(
        (friend) => friend.username !== item.login
      );
    }
  });
  await Promise.all(promises);

  savedUser = await user.save();

  return res.status(200).json({ user: savedUser });
});

router.get("/search-users", async (req, res) => {
  try {
    const searchQueryKeys = Object.keys(req.query);

    const searchQuery = {};

    searchQueryKeys.forEach((item) => {
      const val = req.query[item];
      searchQuery[item] = val;
    });
    // myobj.name
    // myobj[item]
    const searchResults = await User.find(searchQuery);
    res.status(200).json({ users: searchResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete-user/:username", async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ username });
  user.isDeleted = true;
  await user.save();
  res.status(200).json({ user });
});

module.exports = router;
