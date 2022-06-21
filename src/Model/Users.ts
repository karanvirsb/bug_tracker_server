const mongoose = require("mongoose");
const Schema = mongoose.Schema;

export interface IUser {
    username?: String;
    password: String;
    email?: String;
    firstName?: String;
    lastName?: String;
    group_id?: String;
    refreshToken?: String;
    roles?: Object;
}

const usersSchema = new Schema({
    username: { type: String, unique: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    firstName: String,
    lastName: String,
    group_id: String,
    refreshToken: String,
    roles: Object,
});

const Users = mongoose.model("Users", usersSchema);

// FUNCTIONS

// GETS
async function getUser(id: String): Promise<{} | null> {
    let user = [];
    try {
        // to check if its an email
        if (id.includes("@")) {
            user = await Users.find({ email: id }).exec();
            return user;
        }

        user = await Users.find({ username: id }).exec();
        return user;
    } catch (error) {
        return null;
    }
}

async function getUserByRefreshToken(token: String) {
    try {
        const user = await Users.find({ refreshToken: token }).exec();

        if (!user) {
            return [];
        }
        return user;
    } catch (err) {
        return null;
    }
}

// CREATES
async function saveUser(user: IUser): Promise<Boolean | null> {
    try {
        return Users.create(user) ? true : false;
    } catch (error) {
        return null;
    }
}

// UPDATES
async function updateUser(
    username: String,
    updates: Object
): Promise<Boolean | null> {
    try {
        const updatedBook = await Users.updateOne(
            { username: username },
            updates
        );
        return updatedBook.acknowledged;
    } catch (err) {
        return null;
    }
}

// Delete user

async function deleteUser(id: String): Promise<Boolean | null> {
    try {
        const deletedUser = await Users.deleteOne({ username: id });
        return deletedUser.acknowledged;
    } catch (error) {
        return null;
    }
}

exports = { getUser, saveUser, getUserByRefreshToken, updateUser, deleteUser };
