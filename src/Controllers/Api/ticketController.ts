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
    // create a ticket based on assignDev
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
        // checking to see if id was given
        if (!newTicket?.ticketId) {
            // generate id
            let generatedId = await generate();
            let foundTicket: ticketType | null = await TicketService.getTicket({
                filter: "ticketId",
                val: generatedId,
            });

            // if it found a ticket regenerate id
            while (foundTicket) {
                generatedId = await generate();
                foundTicket = await TicketService.getTicket({
                    filter: "ticketId",
                    val: generatedId,
                });
            }
            newTicket["ticketId"] = generatedId;
        }
        // check if ticket parameters are good
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
    try {
        if (!ticketId) {
            throw Error("Invalid Id");
        }
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
    try {
        if (!ticketId) throw Error("Invalid ticketId");
    } catch (error) {
        next(error);
    }

    const updatesKeys = Object.keys(updates);
    // checking to see if the updates keys exist within ticket
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
    const { filterValue, filter } = req.body;
    try {
        if (!filterValue) throw Error("Invalid parameter");
        const ticket: ticketType | null = await TicketService.getTicket({
            filter: filter ?? "ticketId",
            val: filterValue,
        });
        if (ticket) return res.status(200).json(ticket);
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

const getTicketsByProjectId = async (
    req: Request<
        { id: string },
        unknown,
        unknown,
        { page: number; limit: number }
    >,
    res: Response,
    next: NextFunction
) => {
    const id = req.params.id;
    let page = req.query.page;
    let limit = req.query.limit || 10;

    try {
        if (!id) throw Error("Invalid id");
        page = typeof page === "string" ? parseInt(page) : page;
        limit = typeof limit === "string" ? parseInt(limit) : limit;
        const tickets = await TicketService.getTicketsByProjectId({
            projectId: id,
            page: page,
            limit: limit,
        });
        if (tickets.totalDocs > 0) return res.status(200).json(tickets);
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

const getTicketsByUsername = async (
    req: Request<
        { username: string },
        unknown,
        unknown,
        { page: number; limit: number }
    >,
    res: Response,
    next: NextFunction
) => {
    const username = req.params.username;
    let page = req.query.page;
    let limit = req.query.limit || 5;

    try {
        if (!username) throw Error("Invalid username");
        page = typeof page === "string" ? parseInt(page) : page;
        limit = typeof limit === "string" ? parseInt(limit) : limit;
        const tickets = await TicketService.getTicketsByUsername({
            username: username,
            page: page,
            limit: limit,
        });
        if (tickets.totalDocs > 0) return res.status(200).json(tickets);
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
        if (!ticketId || userId) throw new Error("Invalid id");

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
        if (!ticketId || userId) throw new Error("Invalid id");

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
        // captures are ticketStatus, type and severity
        const stats = await TicketService.getStatistics(projectIds);
        if (stats) return res.status(200).json(stats);
        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};

const findTicketInfo = async (
    req: Request<
        {},
        {},
        {},
        { projectId: string; ticketId: string; limit: string }
    >,
    res: Response,
    next: NextFunction
) => {
    const { projectId, ticketId, limit } = req.query;
    const limitNum = parseInt(limit);
    try {
        const ticketInfo = await TicketService.findTicketInfo({
            projectId,
            ticketId,
            limit: limitNum,
        });
        if (ticketInfo) return res.status(200).json(ticketInfo);
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

export {
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
};
