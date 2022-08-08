import { groupType } from "../../Model/Groups";
import mongoose from "mongoose";

const createGroup =
    (Groups: mongoose.PaginateModel<groupType>) =>
    async (groupInfo: groupType): Promise<groupType> => {
        const group = new Groups(groupInfo);
        return await group.save();
    };

const updateGroup =
    (Groups: mongoose.PaginateModel<groupType>) =>
    async (groupId: string, updates: {}) => {
        const updatedGroup = await Groups.updateOne(
            { groupId: groupId },
            updates
        );
        // checking to see if it was updated and atleast 1 got updated
        return updatedGroup.acknowledged && updatedGroup.matchedCount === 1;
    };

const deleteGroup =
    (Groups: mongoose.PaginateModel<groupType>) => async (groupId: String) => {
        const deletedGroup = await Groups.deleteOne({
            groupId: groupId,
        }).exec();
        // checking to see if it was deleted and atleast 1 got deleted
        return deletedGroup.acknowledged && deletedGroup.deletedCount === 1;
    };

const getGroup =
    (Groups: mongoose.PaginateModel<groupType>) =>
    async (groupInfo: {
        filter: "groupId" | "groupInviteCode";
        val: string;
    }) => {
        return await Groups.findOne({
            [groupInfo.filter]: groupInfo.val,
        }).exec();
    };

export default (Group: mongoose.PaginateModel<groupType>) => {
    return {
        createGroup: createGroup(Group),
        deleteGroup: deleteGroup(Group),
        updateGroup: updateGroup(Group),
        getGroup: getGroup(Group),
    };
};
