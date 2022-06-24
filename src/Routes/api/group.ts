export {};

const express = require("express");
const router = express.Router();
const {
    createGroup,
    getGroup,
    updateGroup,
    deleteGroup,
} = require("../../Controllers/groupController");

router.route("/").post(createGroup).put(updateGroup).deleteGroup(deleteGroup);
router.route("/id").get(getGroup);

module.exports = router;
