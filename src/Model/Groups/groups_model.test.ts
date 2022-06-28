export {};
var mongoose = require("mongoose");
var mongoDb = "mongodb://127.0.0.1:27017/bugTracker_test";
mongoose.connect(mongoDb);
import { Groups } from "./index";

describe("Group Model Test", () => {
    beforeAll(async () => {
        await Groups.remove({});
    });

    afterEach(async () => {
        await Groups.remove({});
    });

    afterAll(async () => {
        await Groups.remove({});
        await mongoose.disconnect();
    });

    it("has a module", () => {
        expect(Groups).toBeDefined();
    });

    test("create a group", async () => {
        const group = new Groups({
            groupId: "1",
            groupInviteCode: "Coders#1234",
            groupName: "Coders",
        });

        const savedGroup = await group.save();

        const expectedResult = {
            groupId: "1",
            groupName: "Coders",
            groupInviteCode: "Coders#1234",
        };
        const actualResult = savedGroup;

        expect(actualResult).toMatchObject(expectedResult);
    });

    test("getting a group", async () => {
        const group = new Groups({
            groupId: "1",
            groupName: "Coders",
        });

        await group.save();
        const foundGroup = await Groups.findOne({ groupId: "1" });
        const expectedResult = "Coders";
        const actualResult = foundGroup?.groupName;

        expect(actualResult).toBe(expectedResult);
    });

    test("updating group", async () => {
        const group = new Groups({
            groupId: "1",
            groupName: "Coders",
        });

        await group.save();
        await Groups.updateOne({ groupId: "1" }, { groupName: "Coderz" });

        const foundGroup = await Groups.findOne({ groupId: "1" });
        const expectedResult = "Coderz";
        const actualResult = foundGroup?.groupName;

        expect(actualResult).toBe(expectedResult);
    });

    test("deleting group", async () => {
        const group = new Groups({
            groupId: "1",
            groupName: "Coders",
        });

        await group.save();
        await Groups.deleteOne({ groupId: "1" });

        const foundGroup = await Groups.findOne({ groupId: "1" });
        const expectedResult = null;
        const actualResult = foundGroup;

        expect(actualResult).toBe(expectedResult);
    });
});
