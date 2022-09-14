import mongoose, { Schema, model } from "mongoose";
import { z } from "zod";
import paginate from "mongoose-paginate-v2";

const roles = z.object({
    User: z.string().optional(),
    Admin: z.string().optional(),
});

// const MAX_FILE_SIZE = 100000;
// const ACCEPTED_IMAGE_TYPES = [
//     "image/jpeg",
//     "image/jpg",
//     "image/png",
//     "image/webp",
//     "image/svg+xml",
// ];

const avatarType = z.object({
    data: z.any(),
    contentType: z.enum([
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/svg+xml",
    ]),
});

const IUser = z.object({
    avatar: avatarType.optional(),
    username: z.string().min(4).max(26),
    password: z.string().min(8),
    email: z.string().email(),
    firstName: z.string().min(3, "First Name must be greater than 3 letters"),
    lastName: z.string().min(3),
    groupId: z.string().optional(),
    refreshToken: z.array(z.string()).optional(),
    roles: roles,
});

export type UserType = z.infer<typeof IUser>;

const usersSchema = new Schema<UserType>({
    avatar: Object,
    username: { type: String, unique: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    firstName: String,
    lastName: String,
    groupId: String,
    refreshToken: [String],
    roles: Object,
});

usersSchema.plugin(paginate);

const Users = model<UserType, mongoose.PaginateModel<UserType>>(
    "Users",
    usersSchema
);

export { Users, IUser };
