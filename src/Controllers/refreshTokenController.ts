import { Request, Response } from "express";
import UserService from "../Services/Users";
import jwt from "jsonwebtoken";

interface UserPayload {
    username: String;
    roles: {};
    groupId: String;
}

const handleRefreshToken = async (req: Request, res: Response) => {
    // look for the cookie with the jwt
    const cookies = req.cookies;

    if (!cookies.jwt) return res.sendStatus(401); // unauthorized

    const refreshToken = cookies.jwt;

    const foundUser = await UserService.getUserByRefreshToken(refreshToken);

    if (!foundUser) return res.sendStatus(403);
    try {
        const payload = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        ) as UserPayload;

        if (foundUser.username !== payload?.username)
            return res.sendStatus(403);

        console.log("here");
        const roles = Object.values(foundUser.roles);
        const group_id = Object.values(foundUser.groupId || "");

        // new access token
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: payload?.username,
                    roles: roles,
                    group_id: group_id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "30m" }
        );

        res.status(200).json({ accessToken });
    } catch (error) {
        console.log(error);
        return res.sendStatus(403);
    }
};

export { handleRefreshToken };
