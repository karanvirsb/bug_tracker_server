import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import TicketService from "../../Services/Tickets";
import { ITicket, ticketType } from "../../Model/Tickets";
import generate from "../../Helper/generateId";

const createTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const {
        ticketId,
        title,
        description,
        assignedDev,
        time,
        ticketStatus,
        ticketSeverity,
        ticketType,
        reporterId,
        projectId,
    }: ticketType = req.body;

    let newTicket: ticketType;
    if (assignedDev != undefined) {
        newTicket = {
            ticketId,
            title,
            description,
            assignedDev,
            time,
            ticketStatus,
            ticketSeverity,
            ticketType,
            reporterId,
            projectId,
        };
    } else {
        newTicket = {
            ticketId,
            title,
            description,
            time,
            ticketStatus,
            ticketSeverity,
            ticketType,
            reporterId,
            projectId,
        };
    }

    try {
        if (!newTicket?.ticketId) {
            let generatedId = await generate();
            let foundTicket = await TicketService.getTicket({
                filter: "ticketId",
                attribute: generatedId,
            });

            while (foundTicket) {
                generatedId = await generate();
                foundTicket = await TicketService.getTicket({
                    filter: "ticketId",
                    attribute: generatedId,
                });
            }
            newTicket["ticketId"] = generatedId;
        }
        await ITicket.parseAsync(newTicket);

        const createdTicket = await TicketService.createTicket(newTicket);
        if (createdTicket) return res.sendStatus(200);
        return res.sendStatus(204);
    } catch (error) {
        if (error instanceof ZodError)
            return res.status(400).json({ message: error.message });
        next(error);
    }
};
const deleteTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { ticketId } = req.body;
    if (!ticketId) {
        throw Error("Invalid Id");
    }
    try {
        const deletedTicket = await TicketService.deleteTicket(ticketId);
        if (deletedTicket) return res.sendStatus(200);
        return res.sendStatus(204);
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
    if (!ticketId) throw Error("Invalid ticketId");

    const updatesKeys = Object.keys(updates);

    for (let i = 0; i < updatesKeys.length; i++) {
        if (!ITicket._getCached().keys.includes(updatesKeys[i]))
            return res.status(400).json({
                message: `Update property ${updatesKeys[i]} does not exist`,
            });
    }

    try {
        const updatedTicket = await TicketService.updateTicket(
            ticketId,
            updates
        );
        if (updatedTicket) return res.sendStatus(200);
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
const getTicket = async (req: Request, res: Response, next: NextFunction) => {
    const ticketId = req.params.id;
    if (!ticketId) throw Error("Invalid Id");
    try {
        const ticket = await TicketService.getTicket({
            filter: "ticketId",
            attribute: ticketId,
        });
        if (ticket) return res.status(200).json(ticket);
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
const assignUserToTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { ticketId, userId } = req.body;

    try {
        const addedUser = await TicketService.assignUserToTicket(
            ticketId,
            userId
        );
        if (addedUser) return res.sendStatus(200);
        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};
const removeUserFromTicket = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { ticketId, userId } = req.body;

    try {
        const removedUser = await TicketService.removeUserFromTicket(
            ticketId,
            userId
        );
        if (removedUser) return res.sendStatus(200);
        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};
const getStatistics = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { projectIds } = req.body;
    try {
        const stats = await TicketService.getStatistics(projectIds);
        if (stats) return res.status(200).json(stats);
        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTicket,
    deleteTicket,
    updateTicket,
    getTicket,
    assignUserToTicket,
    removeUserFromTicket,
    getStatistics,
};
