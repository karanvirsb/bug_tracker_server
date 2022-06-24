import { NextFunction, Request, Response } from "express";

export {};
const GroupService = require("../Services/Groups");

const createGroup = async (req: Request, res: Response, next: NextFunction) => {
    const { groupId, groupName } = req.body;
    try {
        const createdGroup = await GroupService.createGroup({
            groupId,
            groupName,
        });
        if (createdGroup) return res.sendStatus(201);
        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};
const getGroup = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const foundGroup = await GroupService.getGroup(id);
        if (foundGroup) return res.status(200).json(foundGroup);
        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};
const updateGroup = async (req: Request, res: Response, next: NextFunction) => {
    const { id, updates } = req.body;

    try {
        const updatedGroup = await GroupService.updateGroup(id, updates);
        if (updatedGroup) return res.sendStatus(200);
        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};
const deleteGroup = () => {};

module.exports = { createGroup, getGroup, updateGroup, deleteGroup };
