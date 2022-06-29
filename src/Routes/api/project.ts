import express from "express";
const router = express.Router();

import {
    createProject,
    getProject,
    updateProject,
    deleteProject,
    addUserToProject,
    removeUserFromProject,
    getAllProjectsByGroupId,
    getAllUsersOfProject,
} from "../../Controllers/Api/projectController";

router.route("/").post(createProject).put(updateProject).delete(deleteProject);
router.route("/id").post(getProject);
router.route("/group/:id").get(getAllProjectsByGroupId);
router.route("/user").post(addUserToProject).delete(removeUserFromProject);
router.route("/user/:id").get(getAllUsersOfProject); // TODO questionable need to rethink if this is needed

export default router;
