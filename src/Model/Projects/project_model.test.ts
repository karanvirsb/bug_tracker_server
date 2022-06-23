export {};
const mongoose = require("mongoose");
const mongodb = "mongodb://localhost:27017/bugTracker_test";
mongoose.connect(mongodb);
const Projects = require("./index");

describe("Project Model Tests", () => {
    beforeAll(async () => {
        await Projects.remove({});
    });

    afterEach(async () => {
        await Projects.remove({});
    });

    afterAll(async () => {
        await Projects.remove({});
        await mongoose.disconnect();
    });

    it("has a module", () => {
        expect(Projects).toBeDefined();
    });

    test("create a project", async () => {
        const project = new Projects({
            projectId: "1",
            groupId: "1",
            projectName: "Bugs",
            projectDesc: "Tracking all the bugs ",
            users: ["1"],
        });

        const savedProject = await project.save();

        const expectedResult = {
            projectId: "1",
            groupId: "1",
            projectName: "Bugs",
            projectDesc: "Tracking all the bugs ",
            users: ["1"],
        };
        const actualResult = savedProject;

        expect(actualResult).toMatchObject(expectedResult);
    });

    test("getting a project", async () => {
        const project = new Projects({
            projectId: "1",
            groupId: "1",
            projectName: "Bugs",
            projectDesc: "Tracking all the bugs ",
            users: ["1"],
        });

        await project.save();
        const foundProject = await Projects.findOne({ projectId: "1" });
        const expectedResult = "Bugs";
        const actualResult = foundProject.projectName;

        expect(actualResult).toBe(expectedResult);
    });

    test("updating project", async () => {
        const project = new Projects({
            projectId: "1",
            groupId: "1",
            projectName: "Bugs",
            projectDesc: "Tracking all the bugs ",
            users: ["1"],
        });

        await project.save();
        await Projects.updateOne(
            { projectId: "1" },
            { projectName: "CoBug Tracker" }
        );

        const foundProject = await Projects.findOne({ projectId: "1" });
        const expectedResult = "CoBug Tracker";
        const actualResult = foundProject.projectName;

        expect(actualResult).toBe(expectedResult);
    });

    test("deleting project", async () => {
        const project = new Projects({
            projectId: "1",
            groupId: "1",
            projectName: "Bugs",
            projectDesc: "Tracking all the bugs ",
            users: ["1"],
        });

        await project.save();
        await Projects.deleteOne({ projectId: "1" });

        const foundProject = await Projects.findOne({ projectId: "1" });
        const expectedResult = null;
        const actualResult = foundProject;

        expect(actualResult).toBe(expectedResult);
    });
});