import { Schema, model } from "mongoose";

export interface ITicket {
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

module.exports = model<ITicket>("Tickets", ticketSchema);
