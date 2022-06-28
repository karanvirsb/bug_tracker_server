export {};

const express = require("express");
const router = express.Router();

const {
    createTicket,
    deleteTicket,
    updateTicket,
    getTicket,
    assignUserToTicket,
    removeUserFromTicket,
    getStatistics,
} = require("../../Controllers/Api/ticketController");

router.route("/").post(createTicket).put(updateTicket).delete(deleteTicket);
router.route("/id").post(getTicket);
router.route("/user").post(assignUserToTicket).delete(removeUserFromTicket);
router.route("/stats").get(getStatistics);

module.exports = router;
