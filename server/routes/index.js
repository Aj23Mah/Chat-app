const express = require("express");
const registerUser = require("../controller/registerUser");
const checkEmail = require("../controller/checkEmail");
const checkPassword = require("../controller/checkPassword");
const userDetails = require("../controller/userDetails");
const logout = require("../controller/logout");
const updateUserDetails = require("../controller/updateUserDetails");
const loginUser = require("../controller/loginUser");
const searchUser = require("../controller/searchUser");

const router = express.Router();

//create user api
router.post("/register", registerUser);
// router.get("/register", (req, res) => {
//   res.send("welcome to register page");
// });

// //check user email
// router.post('/email', checkEmail);
// //check user password
// router.post('/password', checkPassword);

//check login user 
router.post('/login', loginUser);

//login user details
router.get('/user-details', userDetails);
//log out user 
router.get('/logout', logout);
//update user details
router.post('/update-user', updateUserDetails);
//search user 
router.post('/search-user', searchUser);

module.exports = router;
