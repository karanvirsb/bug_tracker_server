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
const deleteTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.body;
    try {
        const deletedTicket = await TicketService.deleteTicket(id);
        if (deletedTicket) return res.sendStatus(200);
        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};
const updateTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { ticketId, updates } = req.body;
    try {
        const updatedTicket = await TicketService.updateTicket(
            ticketId,
            updates
        );
        if (updatedTicket) return res.sendStatus(200);
        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};
const getTicket = async (req: Request, res: Response, next: NextFunction) => {
    const ticketId = req.params.id;

    try {
        const ticket = await TicketService.getTicket({
            filter: "ticketId",
            attribute: ticketId,
        });
        if (ticket) return res.status(200).json(ticket);
        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};
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
