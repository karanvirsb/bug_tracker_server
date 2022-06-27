const GroupService = require("./group_service");
import { Groups } from "../../Model/Groups";
const mongoose = require("mongoose");
const mongodb = "mongodb://localhost:27017/bugTracker_serviceTest";
mongoose.connect(mongodb);

describe("GroupService tests", () => {
    beforeAll(async () => {
        await Groups.remove({});
    });

    afterAll(async () => {
        await Groups.remove({});
        await mongoose.disconnect();
    });

    it("has been defined", () => {
        expect(GroupService).toBeDefined();
        expect(Groups).toBeDefined();
    });

    const groupData = [
        {
            groupId: "1",
            groupName: "Coders",
        },
    ];

    test("create group", async () => {
        const groupService = GroupService(Groups);
        const createdGroup = await groupService.createGroup(groupData[0]);
        const expectedGroup = groupData[0];
        const actualGroup = createdGroup;

        expect(actualGroup).toMatchObject(expectedGroup);
    });

    test("update group", async () => {
        const groupService = GroupService(Groups);
        const updatedGroup = await groupService.updateGroup(
            groupData[0].groupId,
            {
                groupName: "Coderz",
            }
        );

        expect(updatedGroup).toBe(true);
    });

    test("Getting group", async () => {
        const groupService = GroupService(Groups);
        const foundGroup = await groupService.getGroup(groupData[0].groupId);

        expect(foundGroup.groupName).toBe("Coderz");
    });

    test("deleting group", async () => {
        const groupService = GroupService(Groups);
        const deletedGroup = await groupService.deleteGroup(
            groupData[0].groupId
        );

        expect(deletedGroup).toBe(true);
    });
});
