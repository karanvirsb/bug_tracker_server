const ProjectService = require("./project_service");
const Projects = require("../../Model/Projects");
import { IProject } from "../../Model/Projects";
// const sinon = require("sinon");
export {};
const mongoose = require("mongoose");
const mongodb = "mongodb://localhost:27017/bugTracker_serviceTest";
mongoose.connect(mongodb);

describe("ProjectService tests", () => {
    beforeAll(async () => {
        await Projects.remove({});
    });

    afterAll(async () => {
        await Projects.remove({});
        await mongoose.disconnect();
    });

    it("has been defined", () => {
        expect(ProjectService).toBeDefined();
        expect(Projects).toBeDefined();
    });

    const projectData: IProject[] = [
        {
            projectId: "1",
            groupId: "1",
            projectName: "Starter",
            projectDesc: "Creating a starter program",
            users: ["1"],
        },
    ];

    test("create project", async () => {
        const projectService = ProjectService(Projects);
        const createdProject = await projectService.createProject(
            projectData[0]
        );
        const expectedProject = projectData[0];
        const actualProject = createdProject;

        expect(actualProject).toMatchObject(expectedProject);
    });

    test("update project", async () => {
        const projectService = ProjectService(Projects);
        const updatedProject = await projectService.updateProject(
            projectData[0].projectId,
            {
                projectName: "Coderz",
            }
        );

        expect(updatedProject).toBe(true);
    });

    test("Getting project", async () => {
        const projectService = ProjectService(Projects);
        const foundProject = await projectService.getProject(
            projectData[0].projectId
        );

        expect(foundProject.projectName).toBe("Coderz");
    });

    test("deleting project", async () => {
        const projectService = ProjectService(Projects);
        const deletedProject = await projectService.deleteProject(
            projectData[0].projectId
        );

        expect(deletedProject).toBe(true);
    });
});
