import { Schema, model } from "mongoose";
import { z } from "zod";

const IProject = z.object({
    projectId: z.string().min(1),
    groupId: z.string().min(1),
    projectName: z.string().min(5),
    projectDesc: z.string().min(5),
    dateCreated: z.date().optional(),
    users: z.array(z.string()).optional(),
});

export type projectType = z.infer<typeof IProject>;

const projectSchema = new Schema<projectType>({
    projectId: { type: String, unique: true },
    groupId: { type: String },
    projectName: { type: String },
    projectDesc: { type: String },
    dateCreated: { type: Date, default: Date.now },
    users: { type: [] },
});

const Projects = model<projectType>("Projects", projectSchema);

export { Projects, IProject };
