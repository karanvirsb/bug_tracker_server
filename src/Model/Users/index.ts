import { Schema, model } from "mongoose";
import { z } from "zod";

const roles = z.object({
    User: z.string().optional(),
    Admin: z.string().optional(),
});

const IUser = z.object({
    userId: z.string().min(1).optional(),
    username: z.string().min(4).max(26),
    password: z.string().min(8),
    email: z.string().email(),
    firstName: z.string().min(3, "First Name must be greater than 3 letters"),
    lastName: z.string().min(3),
    groupId: z.string().optional(),
    refreshToken: z.string().optional(),
    roles: roles,
});

export type UserType = z.infer<typeof IUser>;

const usersSchema = new Schema<UserType>({
    userId: { type: String, unique: true },
    username: { type: String, unique: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    firstName: String,
    lastName: String,
    groupId: String,
    refreshToken: String,
    roles: Object,
});

const Users = model<UserType>("Users", usersSchema);

export { Users, IUser };
