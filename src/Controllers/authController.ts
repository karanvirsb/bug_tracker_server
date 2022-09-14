import { Request, Response } from "express";
import { z, ZodError } from "zod";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserService from "../Services/Users";

// created object to check if given request are right
const User = z.object({
    username: z.string().min(4).max(26),
    password: z.string().min(8).max(26),
});

const handleLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username and Password are required" });
    }
    try {
        // parsing user
        await User.parseAsync({ username, password });

        const foundUser = await UserService.getUser({
            filter: "username",
            val: username,
        });

        if (!foundUser) {
            return res
                .status(401)
                .json({ message: "User with that username does not exist." });
        }

        const match = await bcrypt.compare(password, foundUser.password);
        //evaulte the password
        if (match) {
            // create JWTs
            let roles = [];
            let roleKeys: keyof typeof foundUser.roles;

            // creating an array of roles rather than an object
            for (roleKeys in foundUser.roles) {
                roles.push(foundUser.roles[roleKeys]);
            }

            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        username: foundUser.username,
                        roles,
                        group_id: foundUser.groupId,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: "15m" }
            );

            const refreshToken = jwt.sign(
                { username: foundUser.username },
                process.env.REFRESH_TOKEN_SECRET!,
                { expiresIn: "1d" }
            );

            await UserService.updateUser(foundUser.username, {
                refreshToken: refreshToken,
            });
            // sending refresh token through cookie for authentication
            res.cookie("jwt", refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: "none",
                secure: true,
            });

            return res.json({
                accessToken: accessToken,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                email: foundUser.email,
                avatar: foundUser.avatar,
            });
        } else {
            return res.status(401).json({ message: "Incorrect password" });
        }
    } catch (error) {
        console.log(error);
        if (error instanceof ZodError) {
            return res.status(403).json({ message: error.message });
        }
    }
};

export { handleLogin };
