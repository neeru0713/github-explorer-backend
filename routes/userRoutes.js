const { User } = require("../models/User");
const GITHUB_TOKEN =
  "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";
const express = require("express");
const router = express.Router();

router.get("/save-user/:username", async (req, res) => {
  const username = req.params.username;

  const userExists = await User.findOne({ userName: username });
  console.log(userExists);
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

router.get("/find-mutual-followers/:username", async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ userName: username });
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
  response = await response.json();

  const promises = response.map(async (item) => {
    const isFollowingRes = await fetch(
      `https://api.github.com/users/${username}/following/${item.login}`,
      { headers }
    );
    if (isFollowingRes.status === 204) {
      item.userName = item.login;
      user.friends.push(item);
    } else if (isFollowingRes.status === 404) {
      user.friends = user.friends.filter(
        (friend) => friend.userName !== item.login
      );
    }
  });
  await Promise.all(promises);

  savedUser = await user.save();

  return res.status(200).json({ user: savedUser });
});

module.exports = router;
