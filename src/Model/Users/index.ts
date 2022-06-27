import { Schema, model } from "mongoose";
import { z } from "zod";

const roles = z.object({
    User: z.string().optional(),
    Admin: z.string().optional(),
});

export const IUser = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
    firstName: z.string().min(3, "First Name must be greater than 3 letters"),
    lastName: z.string(),
    groupId: z.string().optional(),
    refreshToken: z.string().optional(),
    roles: roles,
});

export type UserType = z.infer<typeof IUser>;

// export interface IUser {
//     username?: String;
//     password: String;
//     email?: String;
//     firstName?: String;
//     lastName?: String;
//     group_id?: String;
//     refreshToken?: String;
//     roles?: Object;
// }

const usersSchema = new Schema<UserType>({
    username: { type: String, unique: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    firstName: String,
    lastName: String,
    groupId: String,
    refreshToken: String,
    roles: Object,
});

module.exports = model<UserType>("Users", usersSchema);
