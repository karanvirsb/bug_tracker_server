import { IProject } from "../../Model/Projects";

const createProject =
    (Projects: any) =>
    async (projectInfo: IProject): Promise<Boolean> => {
        const project = new Projects(projectInfo);
        return await project.save();
    };

const updateProject =
    (Projects: any) => async (projectId: String, updates: {}) => {
        const updatedProject = await Projects.updateOne(
            { projectId: projectId },
            updates
        );
        return updatedProject.acknowledged;
    };

const deleteProject = (Projects: any) => async (projectId: String) => {
    const deletedProject = await Projects.deleteOne({
        projectId: projectId,
    }).exec();
    return deletedProject.acknowledged;
};

const getProject =
    (Projects: any) =>
    async (projectInfo: { filter: string; attribute: string }) => {
        return await Projects.find({
            [projectInfo.filter]: projectInfo.attribute,
        }).exec();
    };

const addUserToProject =
    (Projects: any) => async (projectId: String, userId: String) => {
        const project = await Projects.find({
            projectId: projectId,
        }).exec();
        const users: String[] = project[0].users || [];
        users.push(userId);

        return await Projects.updateProject(projectId, { users: users });
    };

const removeUserFromProject =
    (Projects: any) => async (projectId: String, userId: String) => {
        const project = await Projects.find({
            projectId: projectId,
        }).exec();
        const users: String[] = project[0].users || [];
        const filteredUsers = users.filter((user) => user != userId);

        return await Projects.updateProject(projectId, {
            users: filteredUsers,
        });
    };

const getAllProjectsByGroupId = (Projects: any) => async (groupId: String) => {
    const projects = await Projects.find(
        { groupId: groupId },
        "projectId"
    ).exec();
    return projects;
};

const getAllUsersOfProject = (Projects: any) => async (projectId: String) => {
    const users = await Projects.find({ projectId: projectId }, `users`).exec();
    return users;
};

export = (Project: any) => {
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
