const mongoose = require("mongoose");
const mongoDb = "mongodb://127.0.0.1:27017/bugTracker_test";
mongoose.connect(mongoDb);
import { Users } from "./index";

describe("User Model test", () => {
    // before all clear db
    beforeAll(async () => {
        await Users.remove({});
    });

    afterEach(async () => {
        await Users.remove({});
    });

    // disconnect
    afterAll(async () => {
        await Users.remove({});
        await mongoose.disconnect();
    });

    it("has a module", () => {
        expect(Users).toBeDefined();
    });

    test("Create User", async () => {
        const user = new Users({
            username: "John20",
            password: "John_123",
            email: "John@gmail",
            firstName: "John",
            lastName: "Smith",
            roles: { User: "2001" },
        });
        const savedUser = await user.save();
        const expected = "John20";
        const acutal = savedUser.username;

        expect(acutal).toEqual(expected);
    });

    test("get user", async () => {
        const user = new Users({
            username: "John20",
            password: "John_123",
            email: "John@gmail",
            firstName: "John",
            lastName: "Smith",
        });
        await user.save();
        const foundUser = await Users.findOne({ username: "John20" });

        const expected = "John@gmail";
        const actual = foundUser?.email;
        expect(actual).toEqual(expected);
    });

    test("update user", async () => {
        const user = new Users({
            username: "John20",
            password: "John_123",
            email: "John@gmail",
            firstName: "John",
            lastName: "Smith",
        });
        await user.save();
        await Users.updateOne({ username: "John20" }, { firstName: "Johnny" });
        const foundUser = await Users.findOne({ username: "John20" });
        const expected = "Johnny";
        const actual = foundUser?.firstName;

        expect(actual).toBe(expected);
    });

    test("delete user", async () => {
        const user = new Users({
            username: "John20",
            password: "John_123",
            email: "John@gmail",
            firstName: "John",
            lastName: "Smith",
        });
        await user.save();
        await Users.deleteOne({ username: "John20" });
        const foundUser = await Users.findOne({ username: "John20" });

        const expected = null;
        const actual = foundUser;

        expect(actual).toBe(expected);
    });
});
