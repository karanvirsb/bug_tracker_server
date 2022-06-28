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
        // checking to see if it was updated and atleast 1 got updated
        return updatedProject.acknowledged && updatedProject.matchedCount === 1;
    };

const deleteProject = (Projects: typeof Model<projectType>) => async (projectId: String) => {
    const deletedProject = await Projects.deleteOne({
        projectId: projectId,
    }).exec();
    // checking to see if it was deleted and atleast 1 got deleted
    return deletedProject.acknowledged && deletedProject.deletedCount === 1;
};

const getProject =
    (Projects: typeof Model<projectType>) =>
    async (projectInfo: { filter: "projectId" | "projectName", val: String }) => {
        return await Projects.findOne({
            [projectInfo.filter]: projectInfo.val,
        }).exec();
    };

const addUserToProject =
    (Projects: typeof Model<projectType>) => async (projectId: String, userId: String) => {
        /*
        * add a new user to a project 
        */
        const project = await Projects.findOne({
            projectId: projectId,
        }).exec();
        // get the userId arr and add new user to it
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
         /*
        * add a new user to a project 
        */
        const project = await Projects.findOne({
            projectId: projectId,
        }).exec();
        // find the users arr and filter them out
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
