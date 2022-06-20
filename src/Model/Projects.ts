import { Schema, model } from "mongoose";

interface IProject {
    projectId: String;
    groupId: String;
    projectName: String;
    projectDesc: String;
    dateCreated?: Date;
    users?: [];
}

const projectSchema = new Schema<IProject>({
    projectId: { type: String, unique: true },
    groupId: { type: String },
    projectName: { type: String },
    projectDesc: { type: String },
    dateCreated: { type: Date, default: Date.now },
    users: { type: [] },
});

const Projects = model<IProject>("Projects", projectSchema);

// FUNCTIONS
async function createProject(projectInfo: IProject): Promise<Boolean> {
    let project = null;
    try {
        project = (await Projects.create(projectInfo)) ? true : false;
    } catch (err) {
        return false;
    }
    return project ? true : false;
}

async function updateProject(projectId: String, updates: {}) {
    try {
        const updatedProject = await Projects.updateOne(
            { projectId: projectId },
            updates
        );
        return updatedProject.acknowledged;
    } catch (err) {
        return false;
    }
}

async function deleteProject(projectId: String) {
    try {
        const deletedProject = await Projects.deleteOne({
            projectId: projectId,
        }).exec();
        return deletedProject.acknowledged;
    } catch (err) {
        return false;
    }
}

async function getProject(projectInfo: { filter: string; attribute: string }) {
    try {
        return await Projects.find({
            [projectInfo.filter]: projectInfo.attribute,
        }).exec();
    } catch (err) {
        return [];
    }
}

async function addUserToProject(projectId: String, userId: String) {
    try {
        const project = await Projects.find({ projectId: projectId }).exec();
        const users: String[] = project[0].users || [];
        users.push(userId);

        return await updateProject(projectId, { users: users });
    } catch (error) {
        return false;
    }
}

async function removeUserFromProject(projectId: String, userId: String) {
    try {
        const project = await Projects.find({ projectId: projectId }).exec();
        const users: String[] = project[0].users || [];
        const filteredUsers = users.filter((user) => user != userId);

        return await updateProject(projectId, { users: filteredUsers });
    } catch (error) {
        return false;
    }
}

async function getAllProjectsByGroupId(groupId: String) {
    try {
        const projects = await Projects.find(
            { groupId: groupId },
            "projectId"
        ).exec();
        return projects;
    } catch (error) {
        return {};
    }
}

async function getAllUsersOfProject(projectId: String) {
    try {
        const users = await Projects.find(
            { projectId: projectId },
            `users`
        ).exec();
        return users;
    } catch (error) {
        return {};
    }
}

export = {
    createProject,
    deleteProject,
    updateProject,
    getProject,
    addUserToProject,
    removeUserFromProject,
    getAllProjectsByGroupId,
    getAllUsersOfProject,
};
