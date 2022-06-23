import { Schema, model } from "mongoose";

export interface IGroup {
    groupId: string;
    groupName: string;
    dateCreated?: Date;
}

const groupSchema = new Schema<IGroup>({
    groupId: { type: String, unique: true },
    groupName: { type: String, unique: true },
    dateCreated: { type: Date, default: Date.now },
});

module.exports = model<IGroup>("Groups", groupSchema);
