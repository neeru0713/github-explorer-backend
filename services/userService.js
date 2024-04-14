const { User } = require("../models/User");
require("dotenv").config();

async function saveUser(username) {
  const userExists = await User.findOne({ username });
  const result = {};
  if (userExists) {
    result.success = false;
    result.message = "User already exists";
    result.user = userExists;
    return result;
  } else {
    let response = await fetch(`https://api.github.com/users/${username}`);
    response = await response.json();
    if (response?.login) {
      response.username = username;
      const user = new User(response);
      const userDetails = await user.save();
      result.success = true;
      result.message = "User created successfuly";
      result.user = userDetails;
      return result;
    } else {
      result.success = false;
      result.message = "User does not exist in github";
      result.user = null;
      return result;
    }
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
      mutualFollowers.push({ ...follower, username: follower.login });
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

async function deleteUser(username) {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("User not found");
  }
  user.isDeleted = true;
  await user.save();
  return user;
}

async function updateUser(username, updates) {
  const updatedUser = await User.findOneAndUpdate(
    { username: username },
    { $set: updates },
    { new: true }
  );
  if (!updatedUser) {
    throw new Error("User not found");
  }
  return updatedUser;
}

async function listUsers(sortBy) {
  try {
    let users = await User.find({ isDeleted: false });

    if (sortBy) {
      users = users.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return 1;
        if (a[sortBy] > b[sortBy]) return -1;
        return 0;
      });
    }

    return users;
  } catch (error) {
    throw new Error("Error listing users");
  }
}

module.exports = {
  saveUser,
  findMutualFollowers,
  searchUsers,
  deleteUser,
  updateUser,
  listUsers,
};
