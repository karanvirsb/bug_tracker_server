import { Request, Response } from "express";
import { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { getUserByRefreshToken } from "../Controllers/Api/userController";
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req: Request, res: Response) => {
    // look for the cookie with the jwt
    const cookies = req.cookies;

    if (!cookies.jwt) return res.sendStatus(401); // unauthorized

    const refreshToken = cookies.jwt;

    const foundUser = await getUserByRefreshToken(refreshToken);

    if (!foundUser.data) return res.sendStatus(403);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err: VerifyErrors, decoded: JwtPayload) => {
            if (err || foundUser.data.username !== decoded.username)
                return res.sendStatus(403);

            const roles = Object.values(foundUser.data.roles);
            const group_id = Object.values(foundUser.data.group_id);

            // new access token
            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        username: decoded.username,
                        roles: roles,
                        group_id: group_id,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "30m" }
            );

            res.json({ accessToken });
        }
    );
};

module.exports = { handleRefreshToken };
