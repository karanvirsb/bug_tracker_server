import { Model } from "mongoose";
import { projectType } from "../../Model/Projects";

const createProject =
    (Projects: typeof Model<projectType>) =>
    async (projectInfo: projectType) => {
        const project = new Projects(projectInfo);
        return await project.save();
    };

const updateProject =
    (Projects: typeof Model<projectType>) => async (projectId: String, updates: {}) => {
        const updatedProject = await Projects.updateOne(
            { projectId: projectId },
            updates
        );
        return updatedProject.acknowledged && updatedProject.matchedCount === 1;
    };

const deleteProject = (Projects: typeof Model<projectType>) => async (projectId: String) => {
    const deletedProject = await Projects.deleteOne({
        projectId: projectId,
    }).exec();
    return deletedProject.acknowledged;
};

const getProject =
    (Projects: typeof Model<projectType>) =>
    async (projectInfo: { filter: string; attribute: String }) => {
        return await Projects.findOne({
            [projectInfo.filter]: projectInfo.attribute,
        }).exec();
    };

const addUserToProject =
    (Projects: typeof Model<projectType>) => async (projectId: String, userId: String) => {
        const project = await Projects.findOne({
            projectId: projectId,
        }).exec();
        const users: String[] = project?.users || [];
        users.push(userId);
        const updatedProject = await Projects.updateOne(
            { projectId: projectId },
            { users: users }
        );
        return updatedProject.acknowledged;
    };

const removeUserFromProject =
    (Projects: typeof Model<projectType>) => async (projectId: String, userId: String) => {
        const project = await Projects.findOne({
            projectId: projectId,
        }).exec();
        const users: String[] = project?.users || [];
        const filteredUsers = users.filter((user) => user != userId);

        const updatedProject = await Projects.updateOne(
            { projectId: projectId },
            { users: filteredUsers }
        );
        return updatedProject.acknowledged;
    };

const getAllProjectsByGroupId = (Projects: typeof Model<projectType>) => async (groupId: String) => {
    const projects = await Projects.find({ groupId: groupId }).exec();
    return projects;
};

const getAllUsersOfProject = (Projects: typeof Model<projectType>) => async (projectId: String) => {
    const users = await Projects.find({ projectId: projectId }, `users`).exec();
    return users;
};

export default (Project: typeof Model<projectType>) => {
    return {
        createProject: createProject(Project),
        deleteProject: deleteProject(Project),
        updateProject: updateProject(Project),
        getProject: getProject(Project),
        addUserToProject: addUserToProject(Project),
        removeUserFromProject: removeUserFromProject(Project),
        getAllProjectsByGroupId: getAllProjectsByGroupId(Project),
        getAllUsersOfProject: getAllUsersOfProject(Project),
    };
};
