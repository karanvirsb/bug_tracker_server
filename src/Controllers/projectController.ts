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
const updateProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id, updates } = req.body;
    try {
        const updatedProject = await ProjectService.updateProject(id, updates);
        if (updatedProject) return res.sendStatus(200);
        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};
const deleteProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.body;

    try {
        const deletedGroup = await ProjectService.deleteProject(id);
        if (deletedGroup) return res.sendStatus(200);
        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};
const addUserToProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { projectId, userId } = req.body;

    try {
        const addedUser = await ProjectService.addUserToProject(
            projectId,
            userId
        );
        if (addedUser) return res.sendStatus(200);
        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};
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
