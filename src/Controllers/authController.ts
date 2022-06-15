import { Request, Response } from "express";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ckey = require("ckey");
const { Users } = require("./databaseController");

const handleLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username and Password are required" });
    }

    const foundUser = await Users.getUser(username);
    if (!foundUser) {
        return res.sendStatus(401);
    }

    const match = await bcrypt.compare(password, foundUser.password);
    //evaulte the password
    if (match) {
        // create JWTs

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: foundUser.username,
                    roles: foundUser.roles,
                    group_id: foundUser.group_id,
                },
            },
            ckey.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { username: foundUser.username },
            ckey.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
        });
        Users.updateUser(foundUser.username, { refreshToken: refreshToken });
        res.json({ accessToken: accessToken });
    } else {
        return res.sendStatus(401);
    }
};

module.exports = { handleLogin };
