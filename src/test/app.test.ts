import { Response } from "express";

require("dotenv").config();

const app = require("../../app");
const mongoose = require("mongoose");
const mongodb = "mongodb://localhost:27017/bugTracker_routes";
const request = require("supertest");
mongoose.connect(mongodb);
import { Users, Groups, Comments, Projects, Tickets } from "../Model";

// TODO get nano ID to generate IDs for Users, Projects, Groups, Tickets, Comments
describe("Testing routes", () => {
    let accessToken = "";
    let refreshToken = "";

    beforeAll(async () => {
        await Users.remove({});
        await Groups.remove({});
        await Comments.remove({});
        await Projects.remove({});
        await Tickets.remove({});
    });

    afterAll(async () => {
        await Users.remove({});
        await Groups.remove({});
        await Comments.remove({});
        await Projects.remove({});
        await Tickets.remove({});
        await mongoose.disconnect();
    });

    it("has been defined", () => {
        expect(app).toBeDefined();
    });

    describe("User Routes", () => {
        test("create new user with registration", async () => {
            return request(app)
                .post("/register")
                .expect(201)
                .send({
                    username: "John20",
                    password: "John_123",
                    firstName: "John",
                    lastName: "Smith",
                    email: "John@Smith.com",
                    role: { User: "1" },
                });
        });

        // TODO give back error for incorrect data types
        test("ERROR: Incorrect parameters", async () => {
            return request(app)
                .post("/register")
                .send({
                    username: "John21",
                    password: "John_123",
                    firstName: "John",
                    lastName: "Smith",
                    email: 1,
                    role: { User: "1" },
                })
                .expect(400)
                .then((response: any) => {
                    expect(response.body).toEqual({
                        message: expect.any(String),
                    });
                });
        });

        test("login user", async () => {
            return request(app)
                .post("/login")
                .expect(200)
                .send({
                    username: "John20",
                    password: "John_123",
                })
                .then((response: any) => {
                    expect(response._body).toEqual(
                        expect.objectContaining({
                            accessToken: expect.any(String),
                        })
                    );
                    accessToken = response._body.accessToken || "";
                });
        });

        // These work
        test("ERROR: bad login request", async () => {
            return request(app)
                .post("/login")
                .send({ username: "Johnny", password: "John_123" })
                .expect(401);
        });

        test("ERROR: Incorrect password", async () => {
            return request(app)
                .post("/login")
                .send({ username: "John20", password: "John_1234" })
                .expect(401);
        });

        test("get user", async () => {
            return request(app)
                .post("/user/id")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ filterValue: "John20", filter: "username" })
                .expect(200)
                .then((response: any) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            __v: expect.any(Number),
                            _id: expect.any(String),
                            password: expect.any(String),
                            email: expect.any(String),
                            firstName: expect.any(String),
                            lastName: expect.any(String),
                            refreshToken: expect.any(String),
                            roles: expect.any(Object),
                            username: expect.any(String),
                        })
                    );
                    refreshToken = response.body.refreshToken || "";
                });
        });

        test("ERROR: Getting user that does not exist", async () => {
            return request(app)
                .post("/user/id")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ filterValue: "John19", filter: "username" })
                .expect(204);
        });

        test("Get user by refreshToken", async () => {
            return request(app)
                .post("/user/token")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ token: refreshToken })
                .expect(200)
                .then((response: any) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            __v: expect.any(Number),
                            _id: expect.any(String),
                            password: expect.any(String),
                            email: expect.any(String),
                            firstName: expect.any(String),
                            lastName: expect.any(String),
                            refreshToken: expect.any(String),
                            roles: expect.any(Object),
                            username: expect.any(String),
                        })
                    );
                });
        });

        test("ERROR: Getting a user with a incorrect refreshToken", async () => {
            return request(app)
                .post("/user/token")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ token: "" })
                .expect(401);
        });

        test("Update user", async () => {
            return request(app)
                .put("/user/id")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ id: "John20", updates: { firstName: "Johnathan" } })
                .expect(200);
        });

        test("ERROR: Update non existing user", async () => {
            return request(app)
                .put("/user/id")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ id: "John25", updates: { firstName: "Johnathan" } })
                .expect(204);
        });

        test("ERROR: updating a property that does not exist", async () => {
            return request(app)
                .put("/user/id")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ id: "John20", updates: { middleName: "Johnathan" } })
                .expect(400)
                .then((response: any) => {
                    expect(response.body).toEqual({
                        message: expect.any(String),
                    });
                });
        });

        test("ERROR: Error unauthorized", async () => {
            return request(app)
                .get("/user/id")
                .send({ id: "John20" })
                .expect(401);
        });

        test("ERROR: Forbidden tempering", async () => {
            return request(app)
                .get("/user/id")
                .set("Authorization", `Bearer ${accessToken + "1"}`)
                .send({ id: "John20" })
                .expect(403);
        });
    });

    describe("Group Route tests", () => {
        test("Create Group", async () => {
            return request(app)
                .post("/group")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ groupId: "1", groupName: "Coderz" })
                .expect(200);
        });

        test("Create a Group without id", async () => {
            return request(app)
                .post("/group")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ groupName: "Codering" })
                .expect(200);
        });

        test("ERROR: Creating group with incorrect data", async () => {
            return request(app)
                .post("/group")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ groupId: "", groupName: "" })
                .expect(400);
        });

        test("Get the group", async () => {
            return request(app)
                .post("/group/id")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ filterValue: 1, filter: "groupId" })
                .expect(200)
                .then((response: any) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            groupId: expect.any(String),
                            groupName: expect.any(String),
                        })
                    );
                });
        });

        test("ERROR: Getting non existent group", async () => {
            return request(app)
                .post("/group/id")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ filterValue: 3, filter: "groupId" })
                .expect(204);
        });

        test("Update the group", async () => {
            return request(app)
                .put("/group")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ id: "1", updates: { groupName: "Coders" } })
                .expect(200);
        });

        test("ERROR: Updating a group that doesnt exist", () => {
            return request(app)
                .put("/group")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ id: "4", updates: { groupName: "Coders" } })
                .expect(204);
        });

        test("ERROR: Updating a group property that isnt allowed", async () => {
            return request(app)
                .put("/group")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ id: "1", updates: { groupType: "Bug" } })
                .expect(400);
        });

        // test("Delete the group", async () => {
        //     return request(app)
        //         .delete("/group")
        //         .set("Authorization", `Bearer ${accessToken}`)
        //         .send({ id: "1" })
        //         .expect(200);
        // });

        test("ERROR: Bad delete", async () => {
            return request(app)
                .delete("/group")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ id: "4" })
                .expect(204);
        });
    });

    describe("Project Route Tests", () => {
        test("create Project", async () => {
            return request(app)
                .post("/project")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    projectId: "1",
                    groupId: "1",
                    projectName: "Bug Tracker",
                    projectDesc: "An application used to track bugs",
                    users: ["1"],
                })
                .expect(200);
        });

        test("create a Project without id", async () => {
            return request(app)
                .post("/project")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    groupId: "1",
                    projectName: "Bug Tracker",
                    projectDesc: "An application used to track bugs",
                    users: ["1"],
                })
                .expect(200);
        });

        test("ERROR: creating a project with incorrect types", async () => {
            return request(app)
                .post("/project")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    projectId: "1",
                    groupId: "",
                    projectName: "Bug Tracker",
                    projectDesc: "An application used to track bugs",
                    users: ["1"],
                })
                .expect(400)
                .then((response: any) => {
                    expect(response.body).toEqual({
                        message: expect.any(String),
                    });
                });
        });

        test("Get project", async () => {
            const id = "1";
            return request(app)
                .post(`/project/id`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ filterValue: id, filter: "projectId" })
                .expect(200)
                .then((response: any) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            projectId: expect.any(String),
                            groupId: expect.any(String),
                        })
                    );
                });
        });

        test("ERROR: Trying to get a project that doesnt exist", async () => {
            const id = "5";
            return request(app)
                .post(`/project/id`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ filterValue: id, filter: "projectId" })
                .expect(204);
        });

        test("update project", async () => {
            return request(app)
                .put("/project")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ id: "1", updates: { projectName: "Bug Tracking" } })
                .expect(200);
        });

        test("ERROR: updating a project that doesnt exist", async () => {
            return request(app)
                .put("/project")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ id: "5", updates: { projectName: "Bug Tracking" } })
                .expect(204);
        });

        test("ERROR: updating a project with a property that doesnt exist", async () => {
            return request(app)
                .put("/project")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ id: "1", updates: { projectType: "Bug" } })
                .expect(400)
                .then((response: any) => {
                    expect(response.body).toEqual({
                        message: expect.any(String),
                    });
                });
        });

        // test("delete project", async () => {
        //     return request(app)
        //         .delete("/project")
        //         .set("Authorization", `Bearer ${accessToken}`)
        //         .send({ id: "1" })
        //         .expect(200);
        // });

        test("ERROR: deleting a project that doesnt exist", async () => {
            return request(app)
                .delete("/project")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ id: "5" })
                .expect(204);
        });

        test("adding new user to project", async () => {
            return request(app)
                .post("/project/user")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ projectId: "1", userId: "1" })
                .expect(200);
        });

        test("removing user from project", async () => {
            return request(app)
                .delete("/project/user")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ projectId: "1", userId: "1" })
                .expect(200);
        });

        test("getting all projects based on group id", async () => {
            return request(app)
                .get("/project/group/1")
                .set("Authorization", `Bearer ${accessToken}`)
                .send()
                .expect(200)
                .then((response: any) => {
                    expect(response.body[0]).toEqual(
                        expect.objectContaining({
                            projectId: expect.any(String),
                            groupId: expect.any(String),
                        })
                    );
                });
        });

        test("ERROR: Getting a project that doesnt exist based on gorup id", async () => {
            return request(app)
                .get("/project/group/10")
                .set("Authorization", `Bearer ${accessToken}`)
                .send()
                .expect(204);
        });
    });

    describe("Ticket routes test", () => {
        test("Creating a ticket", async () => {
            return request(app)
                .post("/ticket")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    ticketId: "1",
                    title: "Login Bug",
                    description: "Cannot click login",
                    time: 0.5,
                    ticketStatus: "Open",
                    ticketSeverity: "Medium",
                    ticketType: "Bug",
                    reporterId: "1",
                    projectId: "1",
                })
                .expect(200);
        });

        test("Creating a ticket without id", async () => {
            return request(app)
                .post("/ticket")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    title: "Login Bug",
                    description: "Cannot click login",
                    time: 0.5,
                    ticketStatus: "Open",
                    ticketSeverity: "Medium",
                    ticketType: "Bug",
                    reporterId: "1",
                    projectId: "1",
                })
                .expect(200);
        });

        test("ERROR: Creating a ticket with bad data", async () => {
            return request(app)
                .post("/ticket")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    ticketId: "1",
                    title: "Login Bug",
                    description: "Cannot click login",
                    time: "0.5",
                    ticketStatus: "Open",
                    ticketSeverity: "Medium",
                    ticketType: "Bug",
                    reporterId: "",
                    projectId: "",
                })
                .expect(400)
                .then((response: any) => {
                    expect(response.body).toEqual({
                        message: expect.any(String),
                    });
                });
        });

        test("getting ticket", async () => {
            const ticketId = 1;
            return request(app)
                .post("/ticket/id")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ filterValue: ticketId, fitler: "ticketId" })
                .expect(200)
                .then((response: any) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            ticketId: expect.any(String),
                            title: expect.any(String),
                            description: expect.any(String),
                            time: expect.any(Number),
                            ticketStatus: expect.any(String),
                            ticketSeverity: expect.any(String),
                            ticketType: expect.any(String),
                            reporterId: expect.any(String),
                            projectId: expect.any(String),
                        })
                    );
                });
        });

        test("ERROR: Getting back a ticket that does not exist", async () => {
            const ticketId = 10;
            return request(app)
                .post("/ticket/id")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ filterValue: ticketId, fitler: "ticketId" })
                .expect(204);
        });

        test("Update Ticket", async () => {
            return request(app)
                .put("/ticket")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ ticketId: "1", updates: { ticketStatus: "Closed" } })
                .expect(200);
        });

        test("ERROR: Updating a ticket that does not exist", async () => {
            return request(app)
                .put("/ticket")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ ticketId: "12", updates: { ticketStatus: "Closed" } })
                .expect(204);
        });

        test("ERROR: Updating a property that does not exist", async () => {
            return request(app)
                .put("/ticket")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ ticketId: "12", updates: { ticketColumn: "Closed" } })
                .expect(400)
                .then((response: any) => {
                    expect(response.body).toEqual({
                        message: expect.any(String),
                    });
                });
        });

        test("Assign a dev to a ticket", async () => {
            return request(app)
                .post("/ticket/user")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ ticketId: "1", userId: "1" })
                .expect(200);
        });

        test("Remove assigned dev", async () => {
            return request(app)
                .delete("/ticket/user")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ ticketId: "1", userId: "1" })
                .expect(200);
        });

        test("Get statistics", async () => {
            return request(app)
                .get("/ticket/stats")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ projectIds: ["1"] })
                .expect(200)
                .then((response: any) => {
                    expect(response.body[0]).toEqual(
                        expect.objectContaining({
                            ticketStatus: expect.any(String),
                            ticketSeverity: expect.any(String),
                            ticketType: expect.any(String),
                            projectId: expect.any(String),
                        })
                    );
                });
        });
        // test("Delete Ticket", async () => {
        //     return request(app)
        //         .delete("/ticket")
        //         .set("Authorization", `Bearer ${accessToken}`)
        //         .send({ ticketId: "1" })
        //         .expect(200);
        // });

        test("ERROR: bad delete", async () => {
            return request(app)
                .delete("/ticket")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ ticketId: "10" })
                .expect(204);
        });
    });

    describe("Comment Route Tests", () => {
        test("Create a comment", async () => {
            return request(app)
                .post("/comment")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    commentId: "1",
                    userId: "1",
                    ticketId: "1",
                    comment: "Nice job",
                })
                .expect(200);
        });

        test("Create a comment without id", async () => {
            return request(app)
                .post("/comment")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    userId: "1",
                    ticketId: "1",
                    comment: "Nice job",
                })
                .expect(200);
        });

        test("ERROR: Creating comment with bad data", async () => {
            return request(app)
                .post("/comment")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    commentId: "3",
                    userId: "",
                    ticketId: "",
                    comment: "Nice job",
                })
                .expect(400)
                .then((response: any) => {
                    expect(response.body).toEqual({
                        message: expect.any(String),
                    });
                });
        });

        test("Update a comment", async () => {
            return request(app)
                .put("/comment")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    commentId: "1",
                    updates: { comment: "Nice Job Karen" },
                })
                .expect(200);
        });

        test("ERROR: Updating an non existent comment", async () => {
            return request(app)
                .put("/comment")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    commentId: "10",
                    updates: { comment: "Nice Job Karen" },
                })
                .expect(204);
        });

        test("ERROR: Updating a property that does not exist", async () => {
            return request(app)
                .put("/comment")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    commentId: "1",
                    updates: { name: "Karen" },
                })
                .expect(400)
                .then((response: any) => {
                    expect(response.body).toEqual({
                        message: expect.any(String),
                    });
                });
        });

        test("Get a comment", async () => {
            const commentId = 1;
            return request(app)
                .get("/comment/" + commentId)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200)
                .then((response: any) => {
                    expect(response.body).toEqual(
                        expect.objectContaining({
                            commentId: expect.any(String),
                            userId: expect.any(String),
                            ticketId: expect.any(String),
                            comment: expect.any(String),
                        })
                    );
                });
        });

        test("ERROR: Getting a comment that does not exist", async () => {
            const commentId = 12;
            return request(app)
                .get("/comment/" + commentId)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(204);
        });

        test("Replying to a comment", async () => {
            return request(app)
                .post("/comment/reply")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    commentId: "1",
                    reply: {
                        commentId: "2",
                        userId: "2",
                        ticketId: "1",
                        comment: "Nice job Jeff",
                    },
                })
                .expect(200);
        });

        test("ERROR: Replying to a comment that does not exist", async () => {
            return request(app)
                .post("/comment/reply")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    commentId: "10",
                    reply: {
                        commentId: "2",
                        userId: "2",
                        ticketId: "1",
                        comment: "Nice job Jeff",
                    },
                })
                .expect(410);
        });

        test("Get all comments based on replyIds", async () => {
            return request(app)
                .post("/comment/reply/comments")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ replyIdArr: ["2"] })
                .expect(200)
                .then((response: any) => {
                    expect(response.body[0]).toEqual(
                        expect.objectContaining({
                            commentId: expect.any(String),
                            userId: expect.any(String),
                            ticketId: expect.any(String),
                            comment: expect.any(String),
                        })
                    );
                });
        });

        test("Delete a comment", async () => {
            const commentId = 1;

            return request(app)
                .delete("/comment")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ commentId })
                .expect(200);
        });

        test("ERROR: Deleting a non existent comment", async () => {
            const commentId = 15;
            return request(app)
                .delete("/comment")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ commentId })
                .expect(204);
        });
    });
});
