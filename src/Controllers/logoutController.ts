import { Request, Response } from "express";

const UserService = require("../Services/Users");

const handleLogout = async (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(204); // No content to send back
    }

    const refreshToken = cookies.jwt;

    // is the refresh token in the DB?
    const foundUser = await UserService.getUserByRefreshToken(refreshToken);

    // no found user but we have a cookie we clear it
    if (!foundUser) {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
        return res.sendStatus(204); // successful but no content
    }

    // Delete refreshToken in db
    const updated = await UserService.updateUser(foundUser.username, {
        refreshToken: "",
    });

    if (updated) {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        }); // secure: true  - serves on https
        return res.sendStatus(204);
    }
};

module.exports = { handleLogout };
