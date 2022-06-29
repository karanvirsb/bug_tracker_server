import express from "express";
const router = express.Router();

import {
    getUser,
    getUserByRefreshToken,
    createUser,
    deleteUser,
    updateUser,
} from "../../Controllers/Api/userController";

router.route("/").post(createUser);
router.route("/id").post(getUser).put(updateUser).delete(deleteUser);
router.route("/token").post(getUserByRefreshToken);

export default router;
