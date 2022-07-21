import mongoose, { Schema, model } from "mongoose";
import { z } from "zod";
import paginate from "mongoose-paginate-v2";
import { buffer } from "stream/consumers";

const roles = z.object({
    User: z.string().optional(),
    Admin: z.string().optional(),
});

const MAX_FILE_SIZE = 100000;
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/svg+xml",
];

const IUser = z.object({
    userId: z.string().min(1).optional(),
    avatar: z
        .any()
        .refine((files) => files?.length == 1, "Image is required.")
        .refine(
            (files) => files?.[0]?.size <= MAX_FILE_SIZE,
            `Max file size is 1MB.`
        )
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            ".jpg, .jpeg, .png, .svg and .webp files are accepted."
        ),
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
    avatar: { type: buffer },
    username: { type: String, unique: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    firstName: String,
    lastName: String,
    groupId: String,
    refreshToken: String,
    roles: Object,
});

usersSchema.plugin(paginate);

const Users = model<UserType, mongoose.PaginateModel<UserType>>(
    "Users",
    usersSchema
);

export { Users, IUser };
