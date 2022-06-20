import { Schema, model } from "mongoose";

interface ITicket {
    ticketId: Number;
    dateCreated: Date;
    title: String;
    description: String;
    assignedDev?: [];
    time: Number;
    ticketStatus: String;
    ticketSeverity: String;
    ticketType: String;
    reporterId: String;
    projectId: String;
}

// TODO add validation to ticketStatus, severity, and type
const ticketSchema = new Schema<ITicket>({
    ticketId: { type: Number, unique: true },
    dateCreated: { type: Date, default: Date.now },
    title: { type: String },
    description: { type: String },
    assignedDev: { type: [] },
    time: { type: Number },
    ticketStatus: { type: String },
    ticketSeverity: { type: String },
    ticketType: { type: String },
    reporterId: { type: String },
    projectId: { type: String },
});

const Tickets = model<ITicket>("Tickets", ticketSchema);

// FUNCTIONS
async function createTicket(ticketInfo: ITicket): Promise<Boolean> {
    let ticket = null;
    try {
        ticket = (await Tickets.create(ticketInfo)) ? true : false;
    } catch (err) {
        return false;
    }
    return ticket ? true : false;
}

async function updateTicket(ticketId: String, updates: {}) {
    try {
        const updatedTicket = await Tickets.updateOne(
            { ticketId: ticketId },
            updates
        );
        return updatedTicket.acknowledged;
    } catch (err) {
        return false;
    }
}

async function deleteTicket(ticketId: String) {
    try {
        const deletedTicket = await Tickets.deleteOne({
            ticketId: ticketId,
        }).exec();
        return deletedTicket.acknowledged;
    } catch (err) {
        return false;
    }
}

async function getTicket(ticketInfo: { filter: string; attribute: string }) {
    try {
        return await Tickets.find({
            [ticketInfo.filter]: ticketInfo.attribute,
        }).exec();
    } catch (err) {
        return [];
    }
}

async function assignUserToTicket(ticketId: String, userId: String) {
    try {
        const ticket = await Tickets.find({ ticketId: ticketId }).exec();
        const users: String[] = ticket[0].assignedDev || [];
        users.push(userId);

        return await updateTicket(ticketId, { assignedDev: users });
    } catch (error) {
        return false;
    }
}

async function removeUserFromTicket(ticketId: String, userId: String) {
    try {
        const ticket = await Tickets.find({ ticketId: ticketId }).exec();
        const users: String[] = ticket[0].assignedDev || [];
        const filteredUsers = users.filter((user) => user != userId);

        return await updateTicket(ticketId, { assignedDev: filteredUsers });
    } catch (error) {
        return false;
    }
}

async function getStatistics(projectIds: []) {
    try {
        const ticketsArr = [];

        for (let i = 0; i < projectIds.length; i++) {
            const tickets = await Tickets.find(
                { projectId: projectIds[i] },
                "ticketStatus ticketSeverity ticketType"
            ).exec();
            ticketsArr.push(...tickets);
        }
        return ticketsArr;
    } catch (error) {
        return { success: false, status: 500, data: [] };
    }
}

// TODO filter function

export = {
    createTicket,
    deleteTicket,
    updateTicket,
    getTicket,
    assignUserToTicket,
    removeUserFromTicket,
    getStatistics,
};
