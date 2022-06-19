const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO add validation to ticketStatus, severity, and type
const ticketSchema = new Schema({
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
    project: { type: String },
});

const Tickets = mongoose.model("Tickets", ticketSchema);

export = { Tickets };
