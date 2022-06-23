const UserService = require("./user_service");
const Users = require("../../Model/Users");
import { IUser } from "../../Model/Users";
const sinon = require("sinon");
export {};
const mongoose = require("mongoose");
const mongodb = "mongodb://localhost:27017/bugTracker_serviceTest";
mongoose.connect(mongodb);

describe("UserService tests", () => {
    beforeAll(async () => {
        await Users.remove({});
    });

    afterAll(async () => {
        await Users.remove({});
        await mongoose.disconnect();
    });

    const userData: [IUser] = [
        {
            username: "John21",
            password: "John_123",
            email: "John1@gmail",
            firstName: "John",
            lastName: "Smith",
        },
    ];

    it("has a module", () => {
        expect(Users).toBeDefined();
        expect(UserService).toBeDefined();
    });

    test("create user", async () => {
        const userService = UserService(Users);
        const createdUser = await userService.createUser(userData[0]);
        const expectedUser = userData[0];
        const actualUser = createdUser;

        expect(actualUser).toMatchObject(expectedUser);
    });

    test("update user", async () => {
        const userService = UserService(Users);
        const updatedUser = await userService.updateUser(userData[0].username, {
            firstName: "Johnny",
        });

        expect(updatedUser).toBe(true);
    });

    test("Getting user", async () => {
        const userService = UserService(Users);
        const foundUser = await userService.getUser(userData[0].email);

        expect(foundUser.username).toBe("John21");
        expect(foundUser.firstName).toBe("Johnny");
    });

    // test("Create user", async () => {
    //     const save = sinon.spy();
    //     let user;

    //     const MockModel = function (data) {
    //         user = data;
    //         return { user: data, save };
    //     };

    //     const userService = UserService(MockModel);

    //     await userService.createUser(userData.user);

    //     const expected = true;
    //     const actual = save.calledOnce;
    //     expect(actual).toBe(expected);
    //     expect(user).toBe(userData.user);
    // });
});
