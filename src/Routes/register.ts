export = {};
const express = require("express");
const router = express.Router();
const registrationController = require("../Controllers/registerController");

router.post("/register", registrationController.handleNewUser);

module.exports = router;
