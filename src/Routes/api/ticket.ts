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
    getTicketsByUsername,
    findTicketInfo,
} from "../../Controllers/Api/ticketController";

router.route("/").post(createTicket).put(updateTicket).delete(deleteTicket);
router.route("/id").post(getTicket);
router.route("/user").post(assignUserToTicket).delete(removeUserFromTicket);
router.route("/stats").post(getStatistics);
router.route("/project/:id").get(getTicketsByProjectId);
router.route("/user/:username").get(getTicketsByUsername);
router.route("/findTicketInfo").get(findTicketInfo);

export default router;
