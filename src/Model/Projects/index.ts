import mongoose, { Schema, model } from "mongoose";
import { z } from "zod";
import paginate from "mongoose-paginate-v2";

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

projectSchema.plugin(paginate);

const Projects = model<projectType, mongoose.PaginateModel<projectType>>(
    "Projects",
    projectSchema
);

export { Projects, IProject };
