export = {};
const express = require("express");
const router = express.Router();
const registrationController = require("../Controllers/registerController");

router.post("/", registrationController.handleNewUser);

module.exports = router;
