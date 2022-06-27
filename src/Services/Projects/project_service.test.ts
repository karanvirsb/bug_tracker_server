import ProjectService from "./project_service";
import { projectType, Projects } from "../../Model/Projects";

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

    const projectData: projectType[] = [
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
        const foundProject = await projectService.getProject({
            filter: "projectId",
            attribute: projectData[0].projectId,
        });

        expect(foundProject.projectName).toBe("Coderz");
    });

    test("Add user to project", async () => {
        const projectService = ProjectService(Projects);
        const updatedProject = await projectService.addUserToProject(
            projectData[0].projectId,
            "2"
        );

        expect(updatedProject).toBe(true);
    });

    test("Remove user from project", async () => {
        const projectService = ProjectService(Projects);
        const updatedProject = await projectService.removeUserFromProject(
            projectData[0].projectId,
            "2"
        );

        expect(updatedProject).toBe(true);
    });

    test("Getting project by group id", async () => {
        const projectService = ProjectService(Projects);
        const projects = await projectService.getAllProjectsByGroupId("1");

        expect(projects[0].projectName).toBe("Coderz");
    });

    test("Get all users of a project", async () => {
        const projectService = ProjectService(Projects);
        const projects = await projectService.getAllUsersOfProject("1");

        expect(projects[0].users).toStrictEqual(["1"]);
    });

    test("deleting project", async () => {
        const projectService = ProjectService(Projects);
        const deletedProject = await projectService.deleteProject(
            projectData[0].projectId
        );

        expect(deletedProject).toBe(true);
    });
});
