const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController.js');

// Define all routes 

router.get("/save-user/:username", userController.saveUser);

router.get("/find-mutual-followers/:username", userController.findMutualFollowers);

router.get("/search-users", userController.searchUsers);

router.delete("/delete-user/:username", userController.deleteUser)

router.patch("/update-user/:username", userController.updateUser)

router.get("/list-users", userController.listUsers)

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
