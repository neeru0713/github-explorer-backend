const { User } = require("../models/User");
require("dotenv").config();

async function saveUser(username) {
  // Use findOne method of the User model to search for the user by username.
  const userExists = await User.findOne({ username });

  // Initialize a result object to handle the outcome of the user existence check.
  const result = {};
  if (userExists) {
    // Handle the case where a user with the given username already exists in the database in the saveUser function of the user service.
    result.success = false;
    result.message = "User already exists";
    result.user = userExists;
    return result;
  } else {
    let response = await fetch(`https://api.github.com/users/${username}`);
    response = await response.json();
    if (response?.login) {
      // Handle the case where a user with the given username exists in github and create user using that data
      response.username = username;
      const user = new User(response);
      const userDetails = await user.save();
      result.success = true;
      result.message = "User created successfuly";
      result.user = userDetails;
      return result;
    } else {
      // Handle the case where a user with the given username doesn't exist in github 
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
  // pass auth token to github api
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  };
  // get followers of the user
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
    // check if any of the followers are following our user 
    const isFollowingRes = await fetch(
      `https://api.github.com/users/${follower.login}/following/${username}`,
      { headers }
    );
    // if yes , it means they are mutual followers
    if (isFollowingRes.ok) {
      mutualFollowers.push({ ...follower, username: follower.login });
    }
  });
  await Promise.all(promises);
// push mutual followers to friends array
  user.friends = mutualFollowers;

  const savedUser = await user.save();

  return savedUser;
}

async function searchUsers(searchQuery) {
  // search user with filters in search query
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
  // fake delete user using a flag
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
    // return all users who are fake deleted : {isDeleted: false}
    let users = await User.find({ isDeleted: false });
    // sort using comparater and sort field given by user
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
