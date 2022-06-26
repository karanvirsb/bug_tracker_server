import { Model } from "mongoose";
import { UserType } from "../../Model/Users";

// GETS
const getUser =
    (User: typeof Model) =>
    async (
        id: UserType["username"] | UserType["email"]
    ): Promise<UserType | null> => {
        if (!id) throw Error("id was not provided");

        if (id.includes("@")) {
            return await User.findOne({ email: id }).exec();
        }

        return await User.findOne({ username: id }).exec();
    };

//TODO get multiple users

const getAllUsers =
    (User: typeof Model) =>
    async (userIds: String[]): Promise<[] | UserType[]> => {
        if (userIds.length === 0) throw Error("No user Ids were provided");
        const userArr = [];

        for (let i = 0; i < userIds.length; i++) {
            const user = await User.findOne(
                { username: userIds },
                "username email firstName lastName groupId roles"
            );
            userArr.push(user);
        }
        return userArr;
    };

const getUserByRefreshToken =
    (User: typeof Model) =>
    async (token: UserType["refreshToken"]): Promise<UserType> => {
        if (!User) throw Error("User data was not provided");
        const user = await User.findOne({ refreshToken: token }).exec();
        return user;
    };

// CREATES
const saveUser =
    (User: typeof Model) =>
    async (user: UserType): Promise<UserType> => {
        if (!User) throw Error("User data was not provided");
        const createdUser = new User(user);
        return await createdUser.save();
    };

// UPDATES
const updateUser =
    (User: typeof Model) =>
    async (
        username: UserType["username"],
        updates: Object
    ): Promise<Boolean> => {
        if (!username) throw Error("No username was provided");
        if (!updates) throw Error("No updates were provided");

        const updatedUser = await User.updateOne(
            { username: username },
            updates,
            { upsert: false }
        );
        return updatedUser.acknowledged && updatedUser.matchedCount === 1;
    };

// Delete user

const deleteUser =
    (User: typeof Model) =>
    async (id: UserType["username"]): Promise<Boolean> => {
        if (!id) throw Error("No username was passed");
        const deletedUser = await User.deleteOne({ username: id });
        return deletedUser.acknowledged && deletedUser.deletedCount === 1;
    };

// the User here represents the User model
export default (User: typeof Model) => {
    return {
        createUser: saveUser(User),
        getUser: getUser(User),
        getUserByRefreshToken: getUserByRefreshToken(User),
        updateUser: updateUser(User),
        deleteUser: deleteUser(User),
        getAllUsers: getAllUsers(User),
    };
};
