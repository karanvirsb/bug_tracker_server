import mongoose, { Schema, model } from "mongoose";
import { z } from "zod";
import paginate from "mongoose-paginate-v2";

const status = z.enum([
    "Open",
    "Todo",
    "In Progress",
    "To be tested",
    "closed",
]);
const severity = z.enum(["Critical", "High", "Medium", "Low", "None"]);
const type = z.enum(["Bug", "Feature", "Error", "Issue"]);

const ITicket = z.object({
    ticketId: z.string().min(1),
    dateCreated: z.date().optional(),
    title: z.string().min(4),
    description: z.string().min(4),
    assignedDev: z.array(z.string()).optional(),
    time: z.number(),
    ticketStatus: status,
    ticketSeverity: severity,
    ticketType: type,
    reporterId: z.string().min(1),
    projectId: z.string().min(1),
});

export type ticketType = z.infer<typeof ITicket>;

const ticketSchema = new Schema<ticketType>({
    ticketId: { type: String, unique: true },
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

ticketSchema.plugin(paginate);

const Tickets = model<ticketType, mongoose.PaginateModel<ticketType>>(
    "Tickets",
    ticketSchema
);

export { Tickets, ITicket };
