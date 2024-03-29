import mongoose from "mongoose";
import { ticketType } from "../../Model/Tickets";

type params = {
    getTicketsByProjectId: {
        projectId: string;
        page: number;
        limit: number;
    };
    getTicketsByUsername: {
        username: string;
        page: number;
        limit: number;
    };
};

const createTicket =
    (Tickets: mongoose.PaginateModel<ticketType>) =>
    async (ticketInfo: ticketType) => {
        const ticket = new Tickets(ticketInfo);
        return await ticket.save();
    };

const updateTicket =
    (Tickets: mongoose.PaginateModel<ticketType>) =>
    async (ticketId: string, updates: {}) => {
        const updatedTicket = await Tickets.updateOne(
            { ticketId: ticketId },
            updates
        );
        // checking to see if it was updated and atleast 1 got updated
        return updatedTicket.acknowledged && updatedTicket.matchedCount === 1;
    };

const deleteTicket =
    (Tickets: mongoose.PaginateModel<ticketType>) =>
    async (ticketId: string) => {
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

const getTicketsByProjectId =
    (Tickets: mongoose.PaginateModel<ticketType>) =>
    async ({ projectId, page, limit }: params["getTicketsByProjectId"]) => {
        // returing all tickets
        return await Tickets.paginate(
            { projectId: projectId },
            { page: page, limit: limit }
        );
    };

const getAllTicketsByProjectId =
    (Tickets: mongoose.PaginateModel<ticketType>) =>
    async ({ projectId }: { projectId: string }) => {
        return await Tickets.find({ projectId: projectId });
    };

const getTicketsByUsername =
    (Tickets: mongoose.PaginateModel<ticketType>) =>
    async ({ username, page, limit }: params["getTicketsByUsername"]) => {
        return await Tickets.paginate(
            { reporterId: username },
            { page: page, limit: limit }
        );
    };

const findTicketInfo =
    (Tickets: mongoose.PaginateModel<ticketType>) =>
    async ({
        ticketId,
        projectId,
        limit,
    }: {
        ticketId: string;
        projectId: string;
        limit: number;
    }) => {
        const tickets = await Tickets.find({ projectId: projectId }).exec();
        let ticketIndex = -1;

        tickets.forEach((ticket, index) => {
            if (ticket.ticketId === ticketId) {
                ticketIndex = index + 1;
            }
        });

        const ticketsPage = Math.ceil(ticketIndex / limit);
        if (ticketIndex === -1) return {};
        return { ticketsPage, ticketId, projectId, limit };
    };

const assignUserToTicket =
    (Tickets: mongoose.PaginateModel<ticketType>) =>
    async (ticketId: string, userId: string) => {
        /*
         *   assigning dev to a ticker
         */
        const ticket = await Tickets.findOne({ ticketId: ticketId }).exec();
        // getting the users arr and adding id

        const users: string[] = (ticket && ticket.assignedDev) || [];
        users.push(userId);

        const updatedTicket = await Tickets.updateOne(
            { ticketId: ticketId },
            { assignedDev: users }
        );

        return updatedTicket.acknowledged;
    };

const removeUserFromTicket =
    (Tickets: mongoose.PaginateModel<ticketType>) =>
    async (ticketId: string, userId: string) => {
        /*
         * removing an assigned dev
         */
        const ticket = await Tickets.findOne({ ticketId: ticketId }).exec();
        // finding users arr and removing user
        const users: string[] = (ticket && ticket.assignedDev) || [];
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
        getTicketsByUsername: getTicketsByUsername(Ticket),
        getAllTicketsByProjectId: getAllTicketsByProjectId(Ticket),
        findTicketInfo: findTicketInfo(Ticket),
    };
};
