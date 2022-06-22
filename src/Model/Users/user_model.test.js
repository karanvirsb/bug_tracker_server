var mongoose = require("mongoose");
require("jest");
var mongoDb = "mongodb://127.0.0.1:27017/bugTracker_test";
mongoose.connect(mongoDb);
const User = require("./index");

describe("User Model test", () => {
    // before all clear db
    beforeAll(async () => {
        await User.remove({});
    });

    afterEach(async () => {
        await User.remove({});
    });

    // disconnect
    afterAll(async () => {
        await User.remove({});
        await mongoose.disconnect();
    });

    it("has a module", () => {
        expect(User).toBeDefined();
    });

    test("Create User", async () => {
        const user = new User({
            username: "John20",
            password: "John_123",
            email: "John@gmail",
            firstName: "John",
            lastName: "Smith",
        });
        const savedUser = await user.save();
        const expected = "John20";
        const acutal = savedUser.username;

        expect(acutal).toEqual(expected);
    });

    test("get user", async () => {
        const user = new User({
            username: "John20",
            password: "John_123",
            email: "John@gmail",
            firstName: "John",
            lastName: "Smith",
        });
        await user.save();
        const foundUser = await User.findOne({ username: "John20" });

        const expected = "John@gmail";
        const actual = foundUser.email;
        expect(actual).toEqual(expected);
    });

    test("update user", async () => {
        const user = new User({
            username: "John20",
            password: "John_123",
            email: "John@gmail",
            firstName: "John",
            lastName: "Smith",
        });
        await user.save();
        await User.updateOne({ username: "John20" }, { firstName: "Johnny" });
        const foundUser = await User.findOne({ username: "John20" });
        const expected = "Johnny";
        const actual = foundUser.firstName;

        expect(actual).toBe(expected);
    });

    test("delete user", async () => {
        const user = new User({
            username: "John20",
            password: "John_123",
            email: "John@gmail",
            firstName: "John",
            lastName: "Smith",
        });
        await user.save();
        await User.deleteOne({ username: "John20" });
        const foundUser = await User.findOne({ username: "John20" });

        const expected = null;
        const actual = foundUser;

        expect(actual).toBe(expected);
    });
});
