export {};

const express = require("express");
const router = express.Router();

const {
    createComment,
    deleteComment,
    updateComment,
    getComment,
    replyTo,
    getReplyIds,
    getAllComments,
} = require("../../Controllers/Api/commentController");

router.route("/").post(createComment).put(updateComment).delete(deleteComment);
router.route("/id").post(getComment);
router.route("/reply").post(replyTo).get(getReplyIds);
router.route("/reply/comments").post(getAllComments);

module.exports = router;
