import { Schema, model } from "mongoose";

interface ITicket {
    ticketId: Number;
    dateCreated: Date;
    title: String;
    description: String;
    assignedDev?: [String];
    time: Number;
    ticketStatus: String;
    ticketSeverity: String;
    ticketType: String;
    reporter: String;
    projectId: String;
}

// TODO add validation to ticketStatus, severity, and type
const ticketSchema = new Schema<ITicket>({
    ticketId: { type: Number, unique: true },
    dateCreated: { type: Date, default: Date.now },
    title: { type: String },
    description: { type: String },
    assignedDev: { type: [String] },
    time: { type: Number },
    ticketStatus: { type: String },
    ticketSeverity: { type: String },
    ticketType: { type: String },
    reporter: { type: String },
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
        });
        return deletedTicket.acknowledged;
    } catch (err) {
        return false;
    }
}

async function getTicket(ticketInfo: { filter: string; attribute: string }) {
    try {
        return await Tickets.find({
            [ticketInfo.filter]: ticketInfo.attribute,
        });
    } catch (err) {
        return [];
    }
}

export = { Tickets };
