import { Request, Response } from "express";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import { getUser, updateUser } from "./User/userController";

const handleLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    console.log(username, password);
    if (!username || !password) {
        return res
            .status(400)
            .json({ message: "Username and Password are required" });
    }

    const foundUser = await getUser(username);
    if (foundUser.status > 200) {
        return res.sendStatus(401);
    }

    const match = await bcrypt.compare(password, foundUser.data.password);
    //evaulte the password
    if (match) {
        // create JWTs
        const roles = Object.keys(foundUser.data.roles).map(
            (key: string) => foundUser.data.roles[key]
        );
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: foundUser.data.username,
                    roles,
                    group_id: foundUser.data.group_id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { username: foundUser.data.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
        });
        updateUser(foundUser.data.username, { refreshToken: refreshToken });
        return res.json({ accessToken: accessToken });
    } else {
        return res.sendStatus(401);
    }
};

module.exports = { handleLogin };
