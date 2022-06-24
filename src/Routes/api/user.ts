export {};
const express = require("express");
const router = express.Router();
const {
    getUser,
    getUserByRefreshToken,
    createUser,
    deleteUser,
    updateUser,
} = require("../../Controllers/User");

router.route("/id").post(getUser);
