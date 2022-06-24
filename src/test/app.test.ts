import { Response } from "express";
import { ServerResponse } from "http";

export {};
const app = require("../../app");
const mongoose = require("mongoose");
const mongodb = "mongodb://localhost:27017/bugTracker_routes";
const request = require("supertest");
mongoose.connect(mongodb);
describe("Testing routes", () => {
    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });

    it("has been defined", () => {
        expect(app).toBeDefined();
    });

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
                    expect.objectContaining({ accessToken: expect.any(String) })
                );
            });
    });

    test("get user", async () => {
        return request(app)
            .post("/user/id")
            .send({ id: "John20" })
            .expect(200)
            .then((response: any) => {
                console.log(response);
                expect(response.body).toEqual(
                    expect.objectContaining({ username: expect.any(String) })
                );
            });
    });
});
