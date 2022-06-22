const UserService = require("./user_service");
const sinon = require("sinon");

describe("UserService tests", () => {
    const userData = {
        user: {
            username: "John21",
            password: "John_123",
            email: "John1@gmail",
            firstName: "John",
            lastName: "Smith",
        },
    };

    it("has a module", () => {
        expect(UserService).toBeDefined();
    });

    test("Create user", async () => {
        const save = sinon.spy();
        let user;

        const MockModel = function (data) {
            user = data;
            return { user: data, save };
        };

        const userService = UserService(MockModel);

        await userService.createUser(userData.user);

        const expected = true;
        const actual = save.calledOnce;
        expect(actual).toBe(expected);
        expect(user).toBe(userData.user);
    });
});
