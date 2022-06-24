require("dotenv").config();
export {};
const app = require("../../app");
const mongoose = require("mongoose");
const mongodb = "mongodb://localhost:27017/bugTracker_routes";
const request = require("supertest");
mongoose.connect(mongodb);

describe("Testing routes", () => {
    let accessToken = "";
    let refreshToken = "";
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
});
