const { User } = require("../models/User");
const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController.js');




router.get("/save-user/:username", userController.saveUser);

router.get("/find-mutual-followers/:username", userController.findMutualFollowers);

router.get("/search-users", userController.searchUsers);


// router.get("/search-users", async (req, res) => {
//   try {
//     const searchQueryKeys = Object.keys(req.query);

//     const searchQuery = {};

//     searchQueryKeys.forEach((item) => {
//       const val = req.query[item];
//       searchQuery[item] = val;
//     });
//     // myobj.name
//     // myobj[item]
//     const searchResults = await User.find(searchQuery);
//     res.status(200).json({ users: searchResults });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// router.delete("/delete-user/:username", async (req, res) => {
//   const username = req.params.username;
//   const user = await User.findOne({ username });
//   user.isDeleted = true;
//   await user.save();
//   res.status(200).json({ user });
// });

// router.patch("/update-user/:username", async (req, res) => {
//   try {
//     const username = req.params.username;
//     console.log(username);
//     const updates = req.body;
//     console.log(req.body);
//     const updatedUser = await User.findOneAndUpdate(
//       { username: username },
//       { $set: updates },
//       { new: true }
//     );
//     console.log(updatedUser);
//     if (!updatedUser) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     return res.status(200).json({ user: updatedUser });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// router.get("/list-users", async (req, res) => {
//   try {
//     let users = await User.find({isDeleted: false});
//     const fieldUsedForSorting = req.query.sortBy;

//     if (fieldUsedForSorting) {
//         console.log("Before sorting : ", users)

//       users = users.sort((a, b) => {
//         if (a[fieldUsedForSorting] < b[fieldUsedForSorting]) return 1;
//         if (a[fieldUsedForSorting] > b[fieldUsedForSorting]) return -1;
//       });

//       console.log("After sorting : ", users)
//     }
//     return res.status(200).json({ users });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

module.exports = router;
