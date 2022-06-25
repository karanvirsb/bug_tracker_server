export {};

const express = require("express");
const router = express.Router();
const {
    createGroup,
    getGroup,
    updateGroup,
    deleteGroup,
} = require("../../Controllers/Api/groupController");

router.route("/").post(createGroup).put(updateGroup).delete(deleteGroup);
router.route("/:id").get(getGroup);

module.exports = router;
