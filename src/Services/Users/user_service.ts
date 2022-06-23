import { IUser } from "../../Model/Users";

// GETS
const getUser =
    (User: any) =>
    async (id: String): Promise<{} | null> => {
        if (!id) throw Error("id was not provided");

        if (id.includes("@")) {
            return await User.findOne({ email: id }).exec();
        }

        return await User.findOne({ username: id }).exec();
    };

const getUserByRefreshToken = (User: any) => async (token: String) => {
    if (!User) throw Error("User data was not provided");
    const user = await User.findOne({ refreshToken: token }).exec();
    return user;
};

// CREATES
const saveUser = (User: any) => async (user: IUser) => {
    if (!User) throw Error("User data was not provided");
    const createdUser = new User(user);
    return await createdUser.save();
};

// UPDATES
const updateUser =
    (User: any) =>
    async (username: String, updates: Object): Promise<Boolean | null> => {
        if (!username) throw Error("No username was provided");
        if (!updates) throw Error("No updates were provided");

        const updatedUser = await User.updateOne(
            { username: username },
            updates
        );
        return updatedUser.acknowledged;
    };

// Delete user

const deleteUser =
    (User: any) =>
    async (id: String): Promise<Boolean | null> => {
        if (!id) throw Error("No username was passed");
        const deletedUser = await User.deleteOne({ username: id });
        return deletedUser.acknowledged;
    };

// the User here represents the User model
module.exports = (User: any) => {
    return {
        createUser: saveUser(User),
        getUser: getUser(User),
        getUserByRefreshToken: getUserByRefreshToken(User),
        updateUser: updateUser(User),
        deleteUser: deleteUser(User),
    };
};
