import { NextFunction, Request, Response } from "express";
import GroupService from "../../Services/Groups";
import { IGroup, groupType } from "../../Model/Groups";
import { ZodError } from "zod";
import generate from "../../Helper/generateId";
import nanoid from "nanoid/async";

const createGroup = async (req: Request, res: Response, next: NextFunction) => {
    let { groupId, groupName } = req.body;

    try {
        if (!groupId) {
            let generatedId = await generate();
            let foundGroup = await GroupService.getGroup({
                filter: "groupId",
                val: generatedId,
            });

            while (foundGroup) {
                generatedId = await generate();
                foundGroup = await GroupService.getGroup({
                    filter: "groupId",
                    val: generatedId,
                });
            }
            groupId = generatedId;
        }

        let generatedGroupCode = await nanoid.customAlphabet("123456789", 4);
        let inviteCode = groupName + generatedGroupCode;
        let foundGroup = await GroupService.getGroup({
            filter: "groupInviteCode",
            val: inviteCode,
        });

        while (foundGroup) {
            generatedGroupCode = await nanoid.customAlphabet("123456789", 4);
            inviteCode = groupName + generatedGroupCode;
            foundGroup = await GroupService.getGroup({
                filter: "groupInviteCode",
                val: inviteCode,
            });
        }

        await IGroup.parseAsync({
            groupId,
            groupName,
            groupInviteCode: inviteCode,
        });

        const createdGroup = await GroupService.createGroup({
            groupId,
            groupName,
            groupInviteCode: inviteCode,
        });
        if (createdGroup) return res.sendStatus(200);
        return res.sendStatus(204);
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
};
const getGroup = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) throw Error("Id is invalid");

    try {
        const foundGroup = await GroupService.getGroup({
            filter: "groupId",
            val: id,
        });
        if (foundGroup) return res.status(200).json(foundGroup);
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
const updateGroup = async (req: Request, res: Response, next: NextFunction) => {
    const { id, updates } = req.body;
    if (!id) throw Error("Id is invalid");
    const updatesKeys = Object.keys(updates);
    for (let i = 0; i < updatesKeys.length; i++) {
        if (!IGroup._getCached().keys.includes(updatesKeys[i])) {
            return res.status(400).json({
                message: `Update property ${updatesKeys[i]} does not exist`,
            });
        }
    }

    try {
        const updatedGroup = await GroupService.updateGroup(id, updates);
        if (updatedGroup) return res.sendStatus(200);
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
const deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;
    if (!id) throw Error("Id is invalid");
    try {
        const deletedGroup = await GroupService.deleteGroup(id);
        if (deletedGroup) return res.sendStatus(200);
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

module.exports = { createGroup, getGroup, updateGroup, deleteGroup };
