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
        return await Tickets.find({
            [ticketInfo.filter]: ticketInfo.attribute,
        }).exec();
    };

const assignUserToTicket =
    (Tickets: any) => async (ticketId: String, userId: String) => {
        const ticket = await Tickets.find({ ticketId: ticketId }).exec();
        const users: String[] = ticket[0].assignedDev || [];
        users.push(userId);

        return await Tickets.updateTicket(ticketId, { assignedDev: users });
    };

const removeUserFromTicket =
    (Tickets: any) => async (ticketId: String, userId: String) => {
        const ticket = await Tickets.find({ ticketId: ticketId }).exec();
        const users: String[] = ticket[0].assignedDev || [];
        const filteredUsers = users.filter((user) => user != userId);

        return await Tickets.updateTicket(ticketId, {
            assignedDev: filteredUsers,
        });
    };

const getStatistics = (Tickets: any) => async (projectIds: []) => {
    const ticketsArr = [];

    for (let i = 0; i < projectIds.length; i++) {
        const tickets = await Tickets.find(
            { projectId: projectIds[i] },
            "ticketStatus ticketSeverity ticketType"
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
