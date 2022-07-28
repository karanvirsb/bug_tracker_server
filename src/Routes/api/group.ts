import express from "express";
const router = express.Router();

import {
    createGroup,
    getGroup,
    updateGroup,
    deleteGroup,
    refreshInviteCode,
    updateGroupName,
} from "../../Controllers/Api/groupController";

router.route("/").post(createGroup).put(updateGroup).delete(deleteGroup);
router.route("/rename").put(updateGroupName);
router.route("/id").post(getGroup);
router.route("/refresh").put(refreshInviteCode);

export default router;
