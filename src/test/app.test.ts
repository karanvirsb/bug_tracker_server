require("dotenv").config();
export {};
const app = require("../../app");
const mongoose = require("mongoose");
const mongodb = "mongodb://localhost:27017/bugTracker_routes";
const request = require("supertest");
mongoose.connect(mongodb);
// TODO get nano ID to generate IDs for Users, Projects, Groups, Tickets, Comments
describe("Testing routes", () => {
    let accessToken = "";
    let refreshToken = "";
    jest.setTimeout(7500);
    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });

    it("has been defined", () => {
        expect(app).toBeDefined();
    });

    describe("User Routes", () => {
        test("create new user with registration", async () => {
            return request(app).post("/register").expect(201).send({
                username: "John20",
                password: "John_123",
                firstName: "John",
                lastName: "Smith",
                email: "John@Smith",
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

        test("get user", async () => {
            return request(app)
                .post("/user/id")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ id: "John20" })
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

        test("Update user", async () => {
            return request(app)
                .put("/user/id")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ id: "John20", updates: { firstName: "Johnathan" } })
                .expect(200);
        });

        test("Error unauthorized", async () => {
            return request(app)
                .get("/user/id")
                .send({ id: "John20" })
                .expect(401);
        });

        test("Forbidden tempering", async () => {
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
                .expect(201);
        });

        test("Get the group", async () => {
            return request(app)
                .get("/group/1")
                .set("Authorization", `Bearer ${accessToken}`)
                .send()
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

        test("Update the group", async () => {
            return request(app)
                .put("/group")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ id: "1", updates: { groupName: "Coders" } })
                .expect(200);
        });

        // test("Delete the group", async () => {
        //     return request(app)
        //         .delete("/group")
        //         .set("Authorization", `Bearer ${accessToken}`)
        //         .send({ id: "1" })
        //         .expect(200);
        // });
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

        test("Get project", async () => {
            const id = "1";
            return request(app)
                .get(`/project/${id}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .send()
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

        test("update project", async () => {
            return request(app)
                .put("/project")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ id: "1", updates: { projectName: "Bug Tracking" } })
                .expect(200);
        });

        // test("delete project", async () => {
        //     return request(app)
        //         .delete("/project")
        //         .set("Authorization", `Bearer ${accessToken}`)
        //         .send({ id: "1" })
        //         .expect(200);
        // });

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
                    ticketStatus: "open",
                    ticketSeverity: "medium",
                    ticketType: "Bug",
                    reporterId: "1",
                    projectId: "1",
                })
                .expect(200);
        });

        test("getting ticket", async () => {
            const ticketId = 1;
            return request(app)
                .get("/ticket/" + ticketId)
                .set("Authorization", `Bearer ${accessToken}`)
                .send()
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

        test("Update Ticket", async () => {
            return request(app)
                .put("/ticket")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ ticketId: "1", updates: { ticketStatus: "Closed" } })
                .expect(200);
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
                .get("/ticket")
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

        test("Replying to a comment", async () => {
            return request(app)
                .post("/comment/reply")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({
                    commentId: 1,
                    reply: {
                        commentId: "2",
                        userId: "2",
                        ticketId: "1",
                        comment: "Nice job Jeff",
                    },
                })
                .expect(200);
        });

        test("Get all comments based on replyIds", async () => {
            return request(app)
                .post("/comment/reply/comments")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ replyIdArr: ["2"] })
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

        test("Delete a comment", async () => {
            const commentId = 1;

            return request(app)
                .delete("/comment")
                .set("Authorization", `Bearer ${accessToken}`)
                .send({ commentId })
                .expect(200);
        });
    });
});
