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
        return request(app)
            .post("/register")
            .expect("Content-Type", /json/)
            .expect(200)
            .send({
                username: "John20",
                password: "John_123",
                firstName: "John",
                lastName: "Smith",
                email: "John@Smith",
            })
            .then((response: ServerResponse) => {
                expect(response.statusCode).toBe(200);
            });
    });
});
