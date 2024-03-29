import express from "express";
const router = express.Router();

import {
    getUser,
    getUserByRefreshToken,
    createUser,
    deleteUser,
    updateUser,
    getAllUsers,
    getUsersByGroupId,
    removeUserFromGroup,
} from "../../Controllers/Api/userController";

router.route("/").post(createUser);
router.route("/id").post(getUser).put(updateUser).delete(deleteUser);
router.route("/token").post(getUserByRefreshToken);
router.route("/users").post(getAllUsers);
router.route("/group").post(getUsersByGroupId).delete(removeUserFromGroup);

export default router;
