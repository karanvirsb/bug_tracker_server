import { Schema, model } from "mongoose";
import { z } from "zod";

// TODO install nano Id
export const IUser = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
    firstName: z.string().min(3, "First Name must be greater than 3 letters"),
    lastName: z.string(),
    groupId: z.string().optional(),
    refreshToken: z.string().optional(),
    roles: z.string(),
});

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

const usersSchema = new Schema<typeof IUser>();
// ({
//     userId: string,
//     username: { type: String, unique: true },
//     password: { type: String, required: true },
//     email: { type: String, unique: true },
//     firstName: String,
//     lastName: String,
//     group_id: String,
//     refreshToken: String,
//     roles: Object,
// });

module.exports = model<typeof IUser>("Users", usersSchema);
