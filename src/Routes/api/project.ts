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
    getProjectIdsByGroupId,
} from "../../Controllers/Api/projectController";

router.route("/").post(createProject).put(updateProject).delete(deleteProject);
router.route("/id").post(getProject);
router.route("/group/:id").get(getAllProjectsByGroupId);
router.route("/group/projectIds/:id").get(getProjectIdsByGroupId);
router.route("/user").post(addUserToProject).delete(removeUserFromProject);

export default router;
