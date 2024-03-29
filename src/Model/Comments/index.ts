import mongoose, { Schema, model } from "mongoose";
import { z } from "zod";
import paginate from "mongoose-paginate-v2";

const IComment = z.object({
    commentId: z.string().min(1),
    dateCreated: z.date().optional(),
    userId: z.string().min(1),
    ticketId: z.string().min(1).optional(),
    comment: z.string().min(1),
    reply: z.array(z.string()).optional(),
    repliedTo: z.string().optional(),
});

export type commentType = z.infer<typeof IComment>;

const commentSchema = new Schema<commentType>({
    commentId: { type: String, unique: true },
    dateCreated: { type: Date, default: Date.now },
    userId: { type: String },
    ticketId: { type: String },
    comment: { type: String },
    reply: { type: [] },
    repliedTo: { type: String },
});

commentSchema.plugin(paginate);

const Comments = model<commentType, mongoose.PaginateModel<commentType>>(
    "Comments",
    commentSchema
);

export { Comments, IComment };
