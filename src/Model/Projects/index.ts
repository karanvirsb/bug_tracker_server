import { Schema, model } from "mongoose";

export interface IProject {
    projectId: String;
    groupId: String;
    projectName: String;
    projectDesc: String;
    dateCreated?: Date;
    users?: String[];
}

const projectSchema = new Schema<IProject>({
    projectId: { type: String, unique: true },
    groupId: { type: String },
    projectName: { type: String },
    projectDesc: { type: String },
    dateCreated: { type: Date, default: Date.now },
    users: { type: [] },
});

module.exports = model<IProject>("Projects", projectSchema);
