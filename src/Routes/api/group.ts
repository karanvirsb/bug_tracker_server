import express from "express";
const router = express.Router();

import {
    createGroup,
    getGroup,
    updateGroup,
    deleteGroup,
} from "../../Controllers/Api/groupController";

router.route("/").post(createGroup).put(updateGroup).delete(deleteGroup);
router.route("/id").post(getGroup);

export default router;
