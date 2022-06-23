import { ITicket } from "../../Model/Tickets";

const createTicket =
    (Tickets: any) =>
    async (ticketInfo: ITicket): Promise<Boolean> => {
        const ticket = new Tickets(ticketInfo);
        return await ticket.save();
    };

const updateTicket =
    (Tickets: any) => async (ticketId: String, updates: {}) => {
        const updatedTicket = await Tickets.updateOne(
            { ticketId: ticketId },
            updates
        );
        return updatedTicket.acknowledged;
    };

const deleteTicket = (Tickets: any) => async (ticketId: String) => {
    const deletedTicket = await Tickets.deleteOne({
        ticketId: ticketId,
    }).exec();
    return deletedTicket.acknowledged;
};

const getTicket =
    (Tickets: any) =>
    async (ticketInfo: { filter: string; attribute: string }) => {
        return await Tickets.findOne({
            [ticketInfo.filter]: ticketInfo.attribute,
        }).exec();
    };

const assignUserToTicket =
    (Tickets: any) => async (ticketId: String, userId: String) => {
        const ticket = await Tickets.findOne({ ticketId: ticketId }).exec();
        const users: String[] = ticket.assignedDev || [];
        users.push(userId);

        const updatedTicket = await Tickets.updateOne(
            { ticketId: ticketId },
            { assignedDev: users }
        );

        return updatedTicket.acknowledged;
    };

const removeUserFromTicket =
    (Tickets: any) => async (ticketId: String, userId: String) => {
        const ticket = await Tickets.findOne({ ticketId: ticketId }).exec();
        const users: String[] = ticket.assignedDev || [];
        const filteredUsers = users.filter((user) => user != userId);

        const updatedTicket = await Tickets.updateOne(
            { ticketId: ticketId },
            { assignedDev: filteredUsers }
        );

        return updatedTicket.acknowledged;
    };

const getStatistics = (Tickets: any) => async (projectIds: []) => {
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

export = (Ticket: any) => {
    return {
        createTicket: createTicket(Ticket),
        deleteTicket: deleteTicket(Ticket),
        updateTicket: updateTicket(Ticket),
        getTicket: getTicket(Ticket),
        assignUserToTicket: assignUserToTicket(Ticket),
        removeUserFromTicket: removeUserFromTicket(Ticket),
        getStatistics: getStatistics(Ticket),
    };
};
