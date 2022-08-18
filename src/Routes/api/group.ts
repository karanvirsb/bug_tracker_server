import express from "express";
const router = express.Router();
import verifyRoles from "../../Middleware/verifyRoles";
import rolesList from "../../Config/rolesList";

import {
    createGroup,
    getGroup,
    updateGroup,
    deleteGroup,
    refreshInviteCode,
    updateGroupName,
} from "../../Controllers/Api/groupController";

router
    .route("/")
    .post(createGroup)
    .put(updateGroup)
    .delete(verifyRoles(rolesList.ADMIN, rolesList.EDITOR), deleteGroup);
router
    .route("/rename")
    .put(verifyRoles(rolesList.ADMIN, rolesList.EDITOR), updateGroupName);
router.route("/id").post(getGroup);
router
    .route("/refresh")
    .put(verifyRoles(rolesList.ADMIN, rolesList.EDITOR), refreshInviteCode);

export default router;
