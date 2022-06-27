import { Schema, model } from "mongoose";
import { z } from "zod";

const IComment = z.object({
    commentId: z.string().min(1),
    dateCreated: z.date().optional(),
    userId: z.string().min(1),
    ticketId: z.string().min(1),
    comment: z.string().min(4),
    reply: z.array(z.string()).optional(),
});

export type commentType = z.infer<typeof IComment>;
// export interface IComment {
//     commentId: String;
//     dateCreated?: Date;
//     userId: String;
//     ticketId: String;
//     comment: String;
//     reply?: [];
// }

const commentSchema = new Schema<commentType>({
    commentId: { type: String, unique: true },
    dateCreated: { type: Date, default: Date.now },
    userId: { type: String },
    ticketId: { type: String },
    comment: { type: String },
    reply: { type: [] },
});

const Comments = model<commentType>("Comments", commentSchema);

export { Comments, IComment };
