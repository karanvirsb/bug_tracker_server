import { Request, Response } from "express";
import { ZodError } from "zod";
import { UserType, IUser } from "../Model/Users";
import UserService from "../Services/Users";

import bcrypt from "bcrypt";
import axios from "axios";

// created array for background colors of avatars
const colors = [
    "d28100",
    "d1423f",
    "dc1677",
    "c233a0",
    "6163e1",
    "246db6",
    "008290",
    "7ba100",
    "9355d2",
    "627a89",
];

const handleNewUser = async (req: Request, res: Response) => {
    const { username, password, firstName, lastName, email } = req.body;

    if (!username || !password || !firstName || !lastName || !email) {
        return res.status(400).json({
            message:
                "Username, password, email, first and last name are required",
        });
    }

    try {
        // created a temp user to test for parsing
        const tempUser: UserType = {
            username,
            password,
            firstName,
            lastName,
            email,
            roles: { User: "2001" },
        };

        await IUser.parseAsync(tempUser);

        // after parse check for dups
        const duplicateUser = await UserService.getUser({
            filter: "username",
            val: username,
        });

        if (duplicateUser) {
            return res.sendStatus(409); // conflict
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user: UserType = {
            username: username,
            password: hashPassword,
            firstName: firstName,
            lastName: lastName,
            email: email,
            roles: { User: "2001" },
            groupId: "",
            refreshToken: [],
        };
        // fetch avatar for user
        const color = colors[Math.floor(Math.random() * colors.length)];
        const response = await axios(
            `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=${color}&color=fff&length=2&rounded=true&bold=true&format=svg`,
            { method: "get" }
        );

        user["avatar"] = {
            data: response.data,
            contentType: "image/svg+xml",
        };

        const userAdded = await UserService.createUser(user);

        if (userAdded) {
            return res.sendStatus(201);
        } else {
            return res.sendStatus(502);
        }
    } catch (err: any) {
        if (err instanceof ZodError) {
            return res.status(400).json({ message: err.message });
        }
        console.log(err);
    }
};

export { handleNewUser };
