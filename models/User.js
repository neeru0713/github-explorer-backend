const mongoose = require("mongoose");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Complete userSchema, a Mongoose schema for "users" collection
const userSchema = mongoose.Schema({
  userName: {
    type: String,
  },
  id: {
    type: String,
  },
  avatarUrl: {
    type: String,
  },
  type: {
    type: String,
  },
  name: {
    type: String,
  },
  company: {
    type: String,
  },
  blog: {
    type: String,
  },
  location: {
    type: String,
  },
  email: {
    type: String,
  },
  bio: {
    type: String,
  },
  public_repos: {
    type: Number,
  },
  followers: {
    type: Number,
  },
  following: {
    type: Number,
  },
  created_at: {
    type: String,
  },
  updated_at: {
    type: String,
  },
  friends: {
    type: Array,
  }
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
