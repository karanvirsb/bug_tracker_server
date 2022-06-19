import { Schema, model } from "mongoose";

interface IGroup {
    groupId: string;
    groupName: string;
    dateCreated?: Date;
}

const groupSchema = new Schema<IGroup>({
    groupId: { type: String, unique: true },
    groupName: { type: String, unique: true },
    dateCreated: { type: Date, default: Date.now },
});

const Groups = model<IGroup>("Groups", groupSchema);

// FUNCTIONS

async function createGroup(groupInfo: IGroup): Promise<Boolean> {
    let group = null;
    try {
        group = (await Groups.create(groupInfo)) ? true : false;
    } catch (err) {
        return false;
    }
    return group ? true : false;
}

async function updateGroup(groupId: String, updates: {}) {
    try {
        const updatedGroup = await Groups.updateOne(
            { groupId: groupId },
            updates
        );
        return updatedGroup.acknowledged;
    } catch (err) {
        return false;
    }
}

async function deleteGroup(groupId: String) {
    try {
        const deletedGroup = await Groups.deleteOne({ groupId: groupId });
        return deletedGroup.acknowledged;
    } catch (err) {
        return false;
    }
}

async function getGroup(groupInfo: {}) {
    try {
        return await Groups.find(groupInfo);
    } catch (err) {
        return [];
    }
}

export { createGroup, deleteGroup, updateGroup, getGroup };
