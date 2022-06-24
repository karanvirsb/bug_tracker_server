export {};
const express = require("express");
const router = express.Router();
const {
    getUser,
    getUserByRefreshToken,
    createUser,
    deleteUser,
    updateUser,
} = require("../../Controllers/userController");

router.route("/").post(createUser);
router.route("/id").post(getUser).put(updateUser).delete(deleteUser);
router.route("/token").post(getUserByRefreshToken);

module.exports = router;
