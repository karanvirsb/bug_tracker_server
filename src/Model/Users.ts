const mongoose = require("mongoose");
const Schema = mongoose.Schema;

interface IUser {
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

async function getUser(id: String): Promise<IUser | []> {
    let user = [];
    try {
        // to check if its an email
        if (id.includes("@")) {
            user = await Users.find({ email: id }).exec();
            if (!user) {
                return [];
            }
            return user[0];
        }
        user = await Users.find({ username: id }).exec();
        if (!user) {
            return [];
        }
        return user[0];
    } catch (error) {
        return [];
    }
}

async function saveUser(user: IUser): Promise<Boolean> {
    try {
        return Users.create(user) ? true : false;
    } catch (error) {
        return false;
    }
}

async function updateUser(username: String, updates: Object): Promise<Boolean> {
    try {
        const updatedBook = await Users.updateOne(
            { username: username },
            updates
        );
        return updatedBook.acknowledged;
    } catch (err) {
        return false;
    }
}

async function getUserByRefreshToken(token: String) {
    const user = await Users.find({ refreshToken: token }).exec();
    if (!user) {
        return [];
    }
    return user[0];
}

module.exports = {
    getUser,
    saveUser,
    getUserByRefreshToken,
    updateUser,
};

export = { getUser, saveUser, getUserByRefreshToken, updateUser };
