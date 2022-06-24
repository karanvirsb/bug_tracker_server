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

router.route("/").delete(deleteUser).post(createUser);
router.route("/id").post(getUser).put(updateUser);
router.route("/token").post(getUserByRefreshToken);

module.exports = router;
