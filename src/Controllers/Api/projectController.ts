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
            // generate a id if projectId is not given
            let generatedId = await generate();
            let foundProject: projectType | null =
                await ProjectService.getProject({
                    filter: "projectId",
                    val: generatedId,
                });

            // if we keep finding projects keep generarting
            while (foundProject) {
                generatedId = await generate();
                foundProject = await ProjectService.getProject({
                    filter: "projectId",
                    val: generatedId,
                });
            }
            projectId = generatedId;
        }

        // parse the project to see if its good
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
        return res.sendStatus(204);
    } catch (error) {
        if (error instanceof ZodError)
            return res.status(400).json({ message: error.message });
        next(error);
    }
};
const getProject = async (req: Request, res: Response, next: NextFunction) => {
    const { filterValue, filter } = req.body;
    if (!filterValue) throw Error("Invalid parameter");
    try {
        const foundProject: projectType | null =
            await ProjectService.getProject({
                filter: filter ?? "projectId",
                val: filterValue,
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

    // checking to see if update keys exist in project
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
        const deletedProject = await ProjectService.deleteProject(id);
        if (deletedProject) return res.sendStatus(200);
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
    const { projectId, userId } = req.body; // number, string

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
    req: Request<{ id: string }, unknown, unknown, { page: string }>,
    res: Response,
    next: NextFunction
) => {
    const groupId = req.params.id;
    const page = req.query.page;

    if (!groupId) throw Error("Invalid Id");
    console.log(groupId);
    try {
        const project = await ProjectService.getAllProjectsByGroupId(
            groupId,
            parseInt(page)
        );
        if (project.totalDocs > 0) return res.status(200).json(project);
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

export {
    createProject,
    getProject,
    updateProject,
    deleteProject,
    addUserToProject,
    removeUserFromProject,
    getAllProjectsByGroupId,
};
