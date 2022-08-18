import express from "express";
const router = express.Router();
import verifyRoles from "../../Middleware/verifyRoles";
import rolesList from "../../Config/rolesList";

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

router
    .route("/")
    .post(createProject)
    .put(verifyRoles(rolesList.ADMIN, rolesList.EDITOR), updateProject)
    .delete(verifyRoles(rolesList.ADMIN, rolesList.EDITOR), deleteProject);
router.route("/id").post(getProject);
router.route("/group/:id").get(getAllProjectsByGroupId);
router.route("/group/projectIds/:id").get(getProjectIdsByGroupId);
router
    .route("/user")
    .post(verifyRoles(rolesList.ADMIN, rolesList.EDITOR), addUserToProject)
    .delete(
        verifyRoles(rolesList.ADMIN, rolesList.EDITOR),
        removeUserFromProject
    );

export default router;
