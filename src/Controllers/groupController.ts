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
const getGroup = () => {};
const updateGroup = () => {};
const deleteGroup = () => {};

module.exports = { createGroup, getGroup, updateGroup, deleteGroup };
