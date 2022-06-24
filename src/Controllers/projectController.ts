export {};
import { NextFunction, Request, Response } from "express";
const ProjectService = require("../Services/Projects");

const createProject = (req: Request, res: Response, next: NextFunction) => {
    const { projectId, groupId, projectName, projectDesc, users } = req.body;
    try {
        const createdProject = ProjectService.createProject({
            projectId,
            groupId,
            projectName,
            projectDesc,
            users,
        });

        if (createdProject) return res.sendStatus(200);
        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};
const getProject = () => {};
const updateProject = () => {};
const deleteProject = () => {};
const addUserToProject = () => {};
const removeUserFromProject = () => {};
const getAllProjectsByGroupId = () => {};
const getAllUsersOfProject = () => {};

module.exports = {
    createProject,
    getProject,
    updateProject,
    deleteProject,
    addUserToProject,
    removeUserFromProject,
    getAllProjectsByGroupId,
    getAllUsersOfProject,
};
