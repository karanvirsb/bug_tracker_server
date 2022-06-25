export {};

const express = require("express");
const router = express.Router();

const {
    createProject,
    getProject,
    updateProject,
    deleteProject,
    addUserToProject,
    removeUserFromProject,
    getAllProjectsByGroupId,
    getAllUsersOfProject,
} = require("../../Controllers/Api/projectController");

router.route("/").post(createProject).put(updateProject).delete(deleteProject);
router.route("/:id").get(getProject);
router.route("/group/:id").get(getAllProjectsByGroupId);
router.route("/user").post(addUserToProject).delete(removeUserFromProject);
router.route("/user/:id").get(getAllUsersOfProject); // TODO questionable need to rethink if this is needed

module.exports = router;
