import mongoose from "mongoose";
import { number } from "zod";
import { ticketType } from "../../Model/Tickets";

const createTicket =
    (Tickets: mongoose.PaginateModel<ticketType>) =>
    async (ticketInfo: ticketType) => {
        const ticket = new Tickets(ticketInfo);
        return await ticket.save();
    };

const updateTicket =
    (Tickets: mongoose.PaginateModel<ticketType>) =>
    async (ticketId: String, updates: {}) => {
        const updatedTicket = await Tickets.updateOne(
            { ticketId: ticketId },
            updates
        );
        // checking to see if it was updated and atleast 1 got updated
        return updatedTicket.acknowledged && updatedTicket.matchedCount === 1;
    };

const deleteTicket =
    (Tickets: mongoose.PaginateModel<ticketType>) =>
    async (ticketId: String) => {
        const deletedTicket = await Tickets.deleteOne({
            ticketId: ticketId,
        }).exec();
        // checking to see if it was deleted and atleast 1 got deleted
        return deletedTicket.acknowledged && deletedTicket.deletedCount === 1;
    };

const getTicket =
    (Tickets: mongoose.PaginateModel<ticketType>) =>
    async (ticketInfo: {
        filter: "ticketId" | "reporterId" | "projectId";
        val: string;
    }) => {
        return await Tickets.findOne({
            [ticketInfo.filter]: ticketInfo.val,
        }).exec();
    };

type params = {
    getTicketsByProjectId: {
        ticketId: string;
        page: number;
        limit: number;
    };
};
const getTicketsByProjectId =
    (Tickets: mongoose.PaginateModel<ticketType>) =>
    async ({ ticketId, page, limit }: params["getTicketsByProjectId"]) => {
        const tickets = await Tickets.paginate(
            { ticketId: ticketId },
            { page: page, limit: limit }
        );

        return tickets;
    };

const assignUserToTicket =
    (Tickets: mongoose.PaginateModel<ticketType>) =>
    async (ticketId: String, userId: String) => {
        /*
         *   assigning dev to a ticker
         */
        const ticket = await Tickets.findOne({ ticketId: ticketId }).exec();
        // getting the users arr and adding id

        const users: String[] = (ticket && ticket.assignedDev) || [];
        users.push(userId);

        const updatedTicket = await Tickets.updateOne(
            { ticketId: ticketId },
            { assignedDev: users }
        );

        return updatedTicket.acknowledged;
    };

const removeUserFromTicket =
    (Tickets: mongoose.PaginateModel<ticketType>) =>
    async (ticketId: String, userId: String) => {
        /*
         * removing an assigned dev
         */
        const ticket = await Tickets.findOne({ ticketId: ticketId }).exec();
        // finding users arr and removing user
        const users: String[] = (ticket && ticket.assignedDev) || [];
        const filteredUsers = users.filter((user) => user != userId);

        const updatedTicket = await Tickets.updateOne(
            { ticketId: ticketId },
            { assignedDev: filteredUsers }
        );

        return updatedTicket.acknowledged;
    };

const getStatistics =
    (Tickets: mongoose.PaginateModel<ticketType>) =>
    async (projectIds: string[]) => {
        /*
         * Getting back status, severity and type from a project for each group
         */
        const ticketsArr = [];

        for (let i = 0; i < projectIds.length; i++) {
            const tickets = await Tickets.find(
                { projectId: projectIds[i] },
                "ticketStatus ticketSeverity ticketType projectId"
            ).exec();
            ticketsArr.push(...tickets);
        }
        return ticketsArr;
    };

// TODO filter function

export default (Ticket: mongoose.PaginateModel<ticketType>) => {
    return {
        createTicket: createTicket(Ticket),
        deleteTicket: deleteTicket(Ticket),
        updateTicket: updateTicket(Ticket),
        getTicket: getTicket(Ticket),
        assignUserToTicket: assignUserToTicket(Ticket),
        removeUserFromTicket: removeUserFromTicket(Ticket),
        getStatistics: getStatistics(Ticket),
        getTicketsByProjectId: getTicketsByProjectId(Ticket),
    };
};
