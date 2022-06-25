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

router
    .route("/")
    .post(createTicket)
    .put(updateTicket)
    .delete(deleteTicket)
    .get(getStatistics);
router.route("/:id").get(getTicket);
router.route("/user").post(assignUserToTicket).delete(removeUserFromTicket);

module.exports = router;
