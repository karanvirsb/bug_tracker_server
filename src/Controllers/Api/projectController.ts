export {};
import { NextFunction, Request, Response } from "express";
import ProjectService from "../../Services/Projects";

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
const removeUserFromProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { projectId, userId } = req.body;

    try {
        const removedUser = await ProjectService.removeUserFromProject(
            projectId,
            userId
        );
        if (removedUser) return res.sendStatus(200);
        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};
const getAllProjectsByGroupId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const groupId = req.params.id;
    try {
        const project = await ProjectService.getAllProjectsByGroupId(groupId);
        if (project) return res.status(200).json(project);
        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};
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
