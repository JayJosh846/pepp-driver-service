const express = require("express");
const router = express.Router();
const validateNewUserBody = require("../middleware/validateNewUserBody")
const { AppController,
        UserController } = require("../controllers")
const { AuthValidator } = require('../validators')



router.post("/add-phone",  UserController.addPhone);
router.post("/verify-phone",  UserController.verifyPhone);
router.post("/create-user", validateNewUserBody, UserController.createUser); 
router.post("/verify-email",
    AuthValidator.verifyEmailVerificationToken,
    UserController.verifyEmail);
module.exports = router;

 