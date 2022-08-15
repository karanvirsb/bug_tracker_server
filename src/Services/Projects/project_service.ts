import mongoose from "mongoose";
import { projectType } from "../../Model/Projects";

const createProject =
    (Projects: mongoose.PaginateModel<projectType>) =>
    async (projectInfo: projectType) => {
        return await Projects.create(projectInfo);
    };

const updateProject =
    (Projects: mongoose.PaginateModel<projectType>) =>
    async (projectId: string, updates: { [key: string]: any }) => {
        const updatedProject = await Projects.updateOne(
            { projectId: projectId },
            updates
        );
        // checking to see if it was updated and atleast 1 got updated
        return updatedProject.acknowledged && updatedProject.matchedCount === 1;
    };

const deleteProject =
    (Projects: mongoose.PaginateModel<projectType>) =>
    async (projectId: string) => {
        const deletedProject = await Projects.deleteOne({
            projectId: projectId,
        }).exec();
        // checking to see if it was deleted and atleast 1 got deleted
        return deletedProject.acknowledged && deletedProject.deletedCount === 1;
    };

const getProject =
    (Projects: mongoose.PaginateModel<projectType>) =>
    async (projectInfo: {
        filter: "projectId" | "projectName";
        val: string;
    }) => {
        return await Projects.findOne({
            [projectInfo.filter]: projectInfo.val,
        }).exec();
    };

const addUserToProject =
    (Projects: mongoose.PaginateModel<projectType>) =>
    async (projectId: string, userId: string) => {
        /*
         * add a new user to a project
         */
        const project = await Projects.findOne({
            projectId: projectId,
        }).exec();
        // get the userId arr and add new user to it
        const users: string[] = project?.users || [];
        users.push(userId);
        const updatedProject = await Projects.updateOne(
            { projectId: projectId },
            { users: users }
        );
        return updatedProject.acknowledged;
    };

const removeUserFromProject =
    (Projects: mongoose.PaginateModel<projectType>) =>
    async (projectId: string, userId: string) => {
        /*
         * remove user from a project
         */
        const project = await Projects.findOne({
            projectId: projectId,
        }).exec();
        // find the users arr and filter them out
        const users: string[] = project?.users || [];
        const filteredUsers = users.filter((user) => user != userId);

        const updatedProject = await Projects.updateOne(
            { projectId: projectId },
            { users: filteredUsers }
        );
        return updatedProject.acknowledged;
    };

const getAllProjectsByGroupId =
    (Projects: mongoose.PaginateModel<projectType>) =>
    async (groupId: string, pageNumber: number) => {
        // returning all projects
        return await Projects.paginate(
            { groupId: groupId },
            { limit: 5, page: pageNumber }
        );
    };

const getProjectIdsFromGroupId =
    (Projects: mongoose.PaginateModel<projectType>) =>
    async (groupId: string) => {
        return await Projects.find({ groupId: groupId }, "projectId").exec();
    };

const getAllUsersOfProject =
    (Projects: mongoose.PaginateModel<projectType>) =>
    async (projectId: String) => {
        // returning users
        return await Projects.find({ projectId: projectId }, `users`).exec();
    };

export default (Project: mongoose.PaginateModel<projectType>) => {
    return {
        createProject: createProject(Project),
        deleteProject: deleteProject(Project),
        updateProject: updateProject(Project),
        getProject: getProject(Project),
        addUserToProject: addUserToProject(Project),
        removeUserFromProject: removeUserFromProject(Project),
        getAllProjectsByGroupId: getAllProjectsByGroupId(Project),
        getAllUsersOfProject: getAllUsersOfProject(Project),
        getProjectIdsFromGroupId: getProjectIdsFromGroupId(Project),
    };
};
