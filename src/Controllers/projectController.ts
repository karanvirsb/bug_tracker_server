export {};
import { NextFunction, Request, Response } from "express";
const ProjectService = require("../Services/Projects");

const createProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { projectId, groupId, projectName, projectDesc, users } = req.body;
    try {
        const createdProject = await ProjectService.createProject({
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
const getProject = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const foundProject = await ProjectService.getProject({
            filter: "projectId",
            attribute: id,
        });
        if (foundProject) return res.status(200).json(foundProject);

        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};
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
