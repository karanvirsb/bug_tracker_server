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
}

const usersSchema = new Schema({
    username: { type: String, unique: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    firstName: String,
    lastName: String,
    group_id: String,
    refreshToken: String,
});

const Users = mongoose.Model("Users", usersSchema);

module.exports = { Users };
