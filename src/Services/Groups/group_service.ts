import { IGroup } from "../../Model/Groups";

const createGroup =
    (Groups: any) =>
    async (groupInfo: IGroup): Promise<IGroup> => {
        const group = new Groups(groupInfo);
        return await group.save();
    };

const updateGroup = (Groups: any) => async (groupId: String, updates: {}) => {
    const updatedGroup = await Groups.updateOne({ groupId: groupId }, updates);
    return updatedGroup.acknowledged;
};

const deleteGroup = (Groups: any) => async (groupId: String) => {
    const deletedGroup = await Groups.deleteOne({
        groupId: groupId,
    }).exec();
    return deletedGroup.acknowledged;
};

const getGroup = (Groups: any) => async (groupInfo: {}) => {
    return await Groups.findOne(groupInfo).exec();
};

module.exports = (Group: any) => {
    return {
        createGroup: createGroup(Group),
        deleteGroup: deleteGroup(Group),
        updateGroup: updateGroup(Group),
        getGroup: getGroup(Group),
    };
};
