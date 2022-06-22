import { Schema, model } from "mongoose";

export interface IComment {
    commentId: String;
    dateCreated: Date;
    userId: String;
    ticketID: String;
    comment: String;
    reply?: [];
}

const commentSchema = new Schema<IComment>({
    commentId: { type: String, unique: true },
    dateCreated: { type: Date, default: Date.now },
    userId: { type: String },
    ticketID: { type: String },
    comment: { type: String },
    reply: { type: [] },
});

module.exports = model<IComment>("Comments", commentSchema);