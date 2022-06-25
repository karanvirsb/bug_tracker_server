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
} = require("../../Controllers/commentController");

router
    .route("/")
    .post(createComment)
    .put(updateComment)
    .delete(deleteComment)
    .get(getAllComments);
router.route("/:id").get(getComment);
router.route("/reply").post(replyTo).get(getReplyIds);

module.exports = router;
