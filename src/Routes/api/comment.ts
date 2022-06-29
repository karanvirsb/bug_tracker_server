import express from "express";
const router = express.Router();

import {
    createComment,
    deleteComment,
    updateComment,
    getComment,
    replyTo,
    getReplyIds,
    getAllComments,
} from "../../Controllers/Api/commentController";

router.route("/").post(createComment).put(updateComment).delete(deleteComment);
router.route("/id").post(getComment);
router.route("/reply").post(replyTo).get(getReplyIds);
router.route("/reply/comments").post(getAllComments);

export default router;
