import { Schema, model } from "mongoose";

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

const usersSchema = new Schema<IUser>({
    username: { type: String, unique: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    firstName: String,
    lastName: String,
    group_id: String,
    refreshToken: String,
    roles: Object,
});

module.exports = model<IUser>("Users", usersSchema);
