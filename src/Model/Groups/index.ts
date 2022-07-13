import mongoose, { Schema, model } from "mongoose";
import { z } from "zod";
import paginate from "mongoose-paginate-v2";

const IGroup = z.object({
    groupId: z.string().min(1),
    groupName: z.string().min(4).max(50),
    groupInviteCode: z.string().min(8),
    dateCreated: z.date().optional(),
});

export type groupType = z.infer<typeof IGroup>;

const groupSchema = new Schema<groupType>({
    groupId: { type: String, unique: true },
    groupName: { type: String },
    groupInviteCode: { type: String, unique: true },
    dateCreated: { type: Date, default: Date.now },
});

groupSchema.plugin(paginate);

const Groups = model<groupType, mongoose.PaginateModel<groupType>>(
    "Groups",
    groupSchema
);

export { Groups, IGroup };
