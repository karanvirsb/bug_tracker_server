import express from "express";
const router = express.Router();

import {
    createTicket,
    deleteTicket,
    updateTicket,
    getTicket,
    assignUserToTicket,
    removeUserFromTicket,
    getStatistics,
    getTicketsByProjectId,
} from "../../Controllers/Api/ticketController";

router.route("/").post(createTicket).put(updateTicket).delete(deleteTicket);
router.route("/id").post(getTicket);
router.route("/user").post(assignUserToTicket).delete(removeUserFromTicket);
router.route("/stats").get(getStatistics);
router.route("/project/:id").get(getTicketsByProjectId);

export default router;
