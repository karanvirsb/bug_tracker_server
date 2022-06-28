import { Request, Response } from "express";
import { ZodError } from "zod";
import { UserType, IUser } from "../Model/Users";
import UserService from "../Services/Users";

const bcrypt = require("bcrypt");

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
            refreshToken: "",
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

module.exports = { handleNewUser };
export = { handleNewUser };
