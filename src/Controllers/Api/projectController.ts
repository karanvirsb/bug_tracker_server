export {};
import { NextFunction, Request, Response } from "express";
import ProjectService from "../../Services/Projects";
import { projectType, IProject } from "../../Model/Projects";
import { ZodError } from "zod";
import generate from "../../Helper/generateId";

const createProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let { projectId, groupId, projectName, projectDesc, users } = req.body;
    try {
        if (!projectId) {
            let generatedId = await generate();
            let foundProject = await ProjectService.getProject({
                filter: "projectId",
                attribute: generatedId,
            });

            while (foundProject) {
                generatedId = await generate();
                foundProject = await ProjectService.getProject({
                    filter: "projectId",
                    attribute: generatedId,
                });
            }
            projectId = generatedId;
        }

        await IProject.parseAsync({
            projectId,
            groupId,
            projectName,
            projectDesc,
            users,
        });
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
        if (error instanceof ZodError)
            return res.status(400).json({ message: error.message });
        next(error);
    }
};
const getProject = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) throw Error("Invalid Id");
    try {
        const foundProject = await ProjectService.getProject({
            filter: "projectId",
            attribute: id,
        });
        if (foundProject) return res.status(200).json(foundProject);

        return res.sendStatus(204);
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
    if (!id) throw Error("Invalid Id");
    const updatesKeys = Object.keys(updates);

    for (let i = 0; i < updatesKeys.length; i++) {
        if (!IProject._getCached().keys.includes(updatesKeys[i]))
            return res.status(400).json({
                message: `Update property ${updatesKeys[i]} does not exist`,
            });
    }

    try {
        const updatedProject = await ProjectService.updateProject(id, updates);
        if (updatedProject) return res.sendStatus(200);
        return res.sendStatus(204);
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
    if (!id) throw Error("Invalid Id");

    try {
        const deletedGroup = await ProjectService.deleteProject(id);
        if (deletedGroup) return res.sendStatus(200);
        return res.sendStatus(204);
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
    if (!groupId) throw Error("Invalid Id");
    try {
        const project = await ProjectService.getAllProjectsByGroupId(groupId);
        if (project.length > 0) return res.status(200).json(project);
        return res.sendStatus(204);
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
