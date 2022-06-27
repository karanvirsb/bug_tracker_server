import { groupType } from "../../Model/Groups";
import {Model} from 'mongoose';

const createGroup =
    (Groups: typeof Model<groupType>) =>
    async (groupInfo: groupType): Promise<groupType> => {
        const group = new Groups(groupInfo);
        return await group.save();
    };

const updateGroup = (Groups: typeof Model<groupType>) => async (groupId: String, updates: {}) => {
    const updatedGroup = await Groups.updateOne({ groupId: groupId }, updates);
    return updatedGroup.acknowledged;
};

const deleteGroup = (Groups: typeof Model<groupType>) => async (groupId: String) => {
    const deletedGroup = await Groups.deleteOne({
        groupId: groupId,
    }).exec();
    return deletedGroup.acknowledged;
};

const getGroup = (Groups: typeof Model<groupType>) => async (groupId: String) => {
    return await Groups.findOne({ groupId: groupId }).exec();
};

module.exports = (Group: typeof Model<groupType>) => {
    return {
        createGroup: createGroup(Group),
        deleteGroup: deleteGroup(Group),
        updateGroup: updateGroup(Group),
        getGroup: getGroup(Group),
    };
};
