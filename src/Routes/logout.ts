export = {};
const express = require("express");
const router = express.Router();
const logoutController = require("../Controllers/logoutController");

router.delete("/", logoutController.handleLogout);

module.exports = router;
