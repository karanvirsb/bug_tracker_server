import { Request, Response } from "express";
import { z, ZodError } from "zod";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import UserService from "../Services/Users";

const User = z.object({
    username: z.string().min(4).max(26),
    password: z.string().min(8).max(26),
});

const handleLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    console.log(username, password);
    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username and Password are required" });
    }
    try {
        User.parse({ username, password });

        const foundUser = await UserService.getUser({
            filter: "username",
            val: username,
        });
        if (!foundUser) {
            return res.sendStatus(401);
        }

        const match = await bcrypt.compare(password, foundUser.password);
        //evaulte the password
        if (match) {
            // create JWTs
            let roles = [];
            let roleKeys: keyof typeof foundUser.roles;

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
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
            );

            const refreshToken = jwt.sign(
                { username: foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "1d" }
            );

            res.cookie("jwt", refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: "none",
                secure: true,
            });
            UserService.updateUser(foundUser.username, {
                refreshToken: refreshToken,
            });
            return res.json({ accessToken: accessToken });
        } else {
            return res.sendStatus(401);
        }
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(401).json({ message: error.message });
        }
    }
};

module.exports = { handleLogin };
