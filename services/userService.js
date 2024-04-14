const { User } = require("../models/User");
require('dotenv').config();

async function saveUser(username) {
  const userExists = await User.findOne({ username });
  console.log(userExists);
  if (userExists) {
    return null;
  } else {
    let response = await fetch(`https://api.github.com/users/${username}`);
    response = await response.json();
    console.log("1234", response);
    response.username = username;
    const user = new User(response);
    const userDetails = await user.save();
    return userDetails;
  }
}

async function findMutualFollowers(username) {
  const user = await User.findOne({ username });
  if (!user) {
    return null;
  }
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  };

  let response = await fetch(
    `https://api.github.com/users/${username}/followers`,
    { headers }
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch followers for ${username}`);
  }
  const followers = await response.json();

  const mutualFollowers = [];

  const promises = followers.map(async (follower) => {
    const isFollowingRes = await fetch(
      `https://api.github.com/users/${follower.login}/following/${username}`,
      { headers }
    );
    if (isFollowingRes.ok) {
      mutualFollowers.push( { ...follower, username: follower.login });
    }
  });
  await Promise.all(promises);

  user.friends = mutualFollowers;

  const savedUser = await user.save();

  return savedUser;
}


async function searchUsers(searchQuery) {
  const searchResults = await User.find(searchQuery);
  
  if (!searchResults) {
    throw new Error("Error searching users");
  } else {
    return searchResults;
  }
}


module.exports = {
  saveUser,
  findMutualFollowers,
  searchUsers
};
