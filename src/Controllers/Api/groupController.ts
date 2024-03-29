import { NextFunction, Request, Response } from "express";
import GroupService from "../../Services/Groups";
import { IGroup, groupType } from "../../Model/Groups";
import { ZodError } from "zod";
import generate from "../../Helper/generateId";
import { customAlphabet } from "nanoid/async";

const createGroup = async (req: Request, res: Response, next: NextFunction) => {
    let { groupId, groupName } = req.body;

    try {
        // checking to see if the id is given
        if (!groupId) {
            // generating and finding group
            let generatedId = await generate();
            let foundGroup: groupType | null = await GroupService.getGroup({
                filter: "groupId",
                val: generatedId,
            });

            // if group exists keep generating an Id
            while (foundGroup) {
                generatedId = await generate();
                foundGroup = await GroupService.getGroup({
                    filter: "groupId",
                    val: generatedId,
                });
            }
            groupId = generatedId;
        }

        // generate invite code for group
        let nanoid = customAlphabet("123456789", 4);
        let generatedGroupCode = await nanoid();
        let inviteCode = groupName + "#" + generatedGroupCode;
        let foundGroupByInviteCode: groupType | null =
            await GroupService.getGroup({
                filter: "groupInviteCode",
                val: inviteCode,
            });

        // while group exists with code
        while (foundGroupByInviteCode) {
            generatedGroupCode = await nanoid();
            inviteCode = groupName + "#" + generatedGroupCode;
            foundGroupByInviteCode = await GroupService.getGroup({
                filter: "groupInviteCode",
                val: inviteCode,
            });
        }

        // parse group
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
        if (createdGroup) return res.status(200).json(createdGroup);
        return res.sendStatus(204); // if group wasnt created
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
};
const getGroup = async (req: Request, res: Response, next: NextFunction) => {
    const { filterValue, filter } = req.body;

    try {
        if (!filterValue) throw Error("Invalid parameter");

        const foundGroup: groupType | null = await GroupService.getGroup({
            filter: filter ?? "groupId",
            val: filterValue,
        });
        if (foundGroup) return res.status(200).json(foundGroup);
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
const updateGroup = async (req: Request, res: Response, next: NextFunction) => {
    const { id, updates } = req.body;
    try {
        if (!id) throw Error("Id is invalid");
    } catch (error) {
        next(error);
    }
    const updatesKeys = Object.keys(updates);

    // check update keys if they exist
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

const updateGroupName = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id, groupName } = req.body;
    try {
        if (!id) throw Error("Id is invalid");
    } catch (error) {
        next(error);
    }

    if (groupName.length < 4 || groupName.length > 50) {
        return res
            .status(500)
            .json({ message: "Group Name should be between 4-50 characters" });
    }

    let nanoid = customAlphabet("123456789", 4);
    let generatedGroupCode = await nanoid();
    let inviteCode = groupName + "#" + generatedGroupCode;
    let foundGroup: groupType | null = await GroupService.getGroup({
        filter: "groupInviteCode",
        val: inviteCode,
    });

    // while group exists with code
    while (foundGroup) {
        generatedGroupCode = await nanoid();
        inviteCode = groupName + "#" + generatedGroupCode;
        foundGroup = await GroupService.getGroup({
            filter: "groupInviteCode",
            val: inviteCode,
        });
    }

    try {
        const updatedGroup = await GroupService.updateGroup(id, {
            groupName: groupName,
            groupInviteCode: inviteCode,
        });
        if (updatedGroup) return res.sendStatus(200);
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

const refreshInviteCode = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id, groupName } = req.body;
    try {
        if (!id) throw Error("Id is invalid");
    } catch (error) {
        next(error);
    }
    let nanoid = customAlphabet("123456789", 4);
    let generatedGroupCode = await nanoid();
    let inviteCode = groupName + "#" + generatedGroupCode;
    let foundGroup: groupType | null = await GroupService.getGroup({
        filter: "groupInviteCode",
        val: inviteCode,
    });

    // while group exists with code
    while (foundGroup) {
        generatedGroupCode = await nanoid();
        inviteCode = groupName + "#" + generatedGroupCode;
        foundGroup = await GroupService.getGroup({
            filter: "groupInviteCode",
            val: inviteCode,
        });
    }

    try {
        const updatedGroup = await GroupService.updateGroup(id, {
            groupInviteCode: inviteCode,
        });
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

export {
    createGroup,
    getGroup,
    updateGroup,
    deleteGroup,
    refreshInviteCode,
    updateGroupName,
};
