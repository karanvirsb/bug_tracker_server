import mongoose from "mongoose";
import { UserType } from "../../Model/Users";

// GETS
const getUser =
    (User: mongoose.PaginateModel<UserType>) =>
    async (userInfo: {
        filter: "userId" | "username" | "email";
        val: string;
    }): Promise<UserType | null> => {
        if (!userInfo.val) throw Error("id was not provided");

        return await User.findOne({ [userInfo.filter]: userInfo.val }).exec();
    };

const getAllUsers =
    (User: mongoose.PaginateModel<UserType>) =>
    async (userIds: String[]): Promise<[] | UserType[]> => {
        /*
         * gets all users based on their usernames
         */
        if (userIds.length === 0) throw Error("No user Ids were provided");
        const userArr = [];

        for (let i = 0; i < userIds.length; i++) {
            const user = await User.findOne(
                { username: userIds[i] },
                "avatar username email firstName lastName groupId roles"
            );
            if (user) {
                userArr.push(user);
            }
        }
        return userArr;
    };

const getUsersByGroupId =
    (User: mongoose.PaginateModel<UserType>) => async (groupId: string) => {
        if (!groupId) throw Error("No groupId was given");

        const userArr = await User.find(
            { groupId: groupId },
            "avatar username email firstName lastName roles"
        );

        return userArr;
    };

const getUserByRefreshToken =
    (User: mongoose.PaginateModel<UserType>) =>
    async (token: UserType["refreshToken"]): Promise<UserType | null> => {
        if (!User) throw Error("User data was not provided");
        const user = await User.findOne({ refreshToken: token }).exec();
        return user;
    };

// CREATES
const saveUser =
    (User: mongoose.PaginateModel<UserType>) =>
    async (user: UserType): Promise<UserType> => {
        if (!User) throw Error("User data was not provided");
        const createdUser = new User(user);
        return await createdUser.save();
    };

// UPDATES
const updateUser =
    (User: mongoose.PaginateModel<UserType>) =>
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
    (User: mongoose.PaginateModel<UserType>) =>
    async (id: UserType["username"]): Promise<Boolean> => {
        if (!id) throw Error("No username was passed");
        const deletedUser = await User.deleteOne({ username: id });
        return deletedUser.acknowledged && deletedUser.deletedCount === 1;
    };

// the User here represents the User model
export default (User: mongoose.PaginateModel<UserType>) => {
    return {
        createUser: saveUser(User),
        getUser: getUser(User),
        getUserByRefreshToken: getUserByRefreshToken(User),
        updateUser: updateUser(User),
        deleteUser: deleteUser(User),
        getAllUsers: getAllUsers(User),
        getUsersByGroupId: getUsersByGroupId(User),
    };
};
