import { Schema, model } from "mongoose";
import { z } from "zod";
// export interface IGroup {
//     groupId: string;
//     groupName: string;
//     dateCreated?: Date;
// }

const IGroup = z.object({
    groupId: z.string(),
    groupName: z.string().min(4).max(50),
    dateCreated: z.date().optional(),
});

export type groupType = z.infer<typeof IGroup>;

const groupSchema = new Schema<groupType>({
    groupId: { type: String, unique: true },
    groupName: { type: String, unique: true },
    dateCreated: { type: Date, default: Date.now },
});

const Groups = model<groupType>("Groups", groupSchema);

export { Groups, IGroup };
