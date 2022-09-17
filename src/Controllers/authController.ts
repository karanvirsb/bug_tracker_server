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
    const cookies = req.cookies;
    console.log("cookie available at login", JSON.stringify(cookies));
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
                { expiresIn: "10s" }
            );

            const newRefreshToken = jwt.sign(
                { username: foundUser.username },
                process.env.REFRESH_TOKEN_SECRET!,
                { expiresIn: "15d" }
            );

            let newRefreshTokenArray = !cookies.jwt
                ? foundUser.refreshToken || []
                : foundUser?.refreshToken?.filter((rt) => rt !== cookies.jwt) ||
                  [];
            if (cookies.jwt) {
                /* 
            Scenario added here: 
                1) User logs in but never uses RT and does not logout 
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
            */
                const refreshToken = cookies.jwt;
                const foundToken = await UserService.getUserByRefreshToken(
                    refreshToken
                );
                if (!foundToken) {
                    console.log("attempted refresh token reuse at login!");
                    // clear out ALL previous refresh tokens
                    newRefreshTokenArray = [];
                }
                res.clearCookie("jwt", {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                }); // secure: true  - serves on https
            }

            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];

            await UserService.updateUser(foundUser.username, {
                refreshToken: foundUser.refreshToken,
            });
            // sending refresh token through cookie for authentication
            res.cookie("jwt", newRefreshToken, {
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
