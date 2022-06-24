import { Request, Response, NextFunction } from "express";

export {};

const TicketService = require("../Services/Tickets");

const createTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const {
        ticketId,
        dateCreated,
        title,
        description,
        assignedDev = [],
        time,
        ticketStatus,
        ticketSeverity,
        ticketType,
        reporterId,
        projectId,
    } = req.body;
    try {
        const createdTicket = await TicketService.createTicket({
            ticketId,
            dateCreated,
            title,
            description,
            assignedDev,
            time,
            ticketStatus,
            ticketSeverity,
            ticketType,
            reporterId,
            projectId,
        });
        if (createdTicket) return res.sendStatus(200);
        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};
const deleteTicket = async () => {};
const updateTicket = async () => {};
const getTicket = async () => {};
const assignUserToTicket = async () => {};
const removeUserFromTicket = async () => {};
const getStatistics = async () => {};

module.exports = {
    createTicket,
    deleteTicket,
    updateTicket,
    getTicket,
    assignUserToTicket,
    removeUserFromTicket,
    getStatistics,
};
