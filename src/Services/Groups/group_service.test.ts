const GroupService = require("./group_service");
const Groups = require("../../Model/Groups");
import { IGroup } from "../../Model/Groups";
// const sinon = require("sinon");
export {};
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
});
