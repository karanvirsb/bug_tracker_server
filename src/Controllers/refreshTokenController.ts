import { Request, Response } from "express";
import UserService from "../Services/Users";
import jwt from "jsonwebtoken";

interface UserPayload {
    username: string;
    roles: {};
    groupId: string;
}

const handleRefreshToken = async (req: Request, res: Response) => {
    // look for the cookie with the jwt
    const cookies = req.cookies;
    // console.log(cookies);
    if (!cookies.jwt) return res.sendStatus(401); // unauthorized

    const refreshToken = cookies.jwt;
    // delete cookie so can send a new one for rotaiton
    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
    });

    const foundUser = await UserService.getUserByRefreshToken(refreshToken);

    // detected refresh token reuse
    // did get a cookie but that user does not have that refreshToken anymore
    if (!foundUser) {
        // try to delete all the refersh tokens
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!,
            async (err: any, decoded: any) => {
                if (err) return res.sendStatus(403);
                console.log("attempted refresh token reuse");
                const hackedUser = await UserService.getUser({
                    filter: "username",
                    val: decoded.username,
                });
                if (hackedUser) {
                    const result = await UserService.updateUser(
                        hackedUser.username,
                        { refreshToken: [] }
                    );
                    console.log(result);
                }
            }
        );
        return res.sendStatus(403);
    }

    const newRefreshTokenArray =
        foundUser.refreshToken?.filter((rt) => rt !== refreshToken) || [];

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        async (err: any, decoded: any) => {
            if (err) {
                console.log("expired token");
                // we receive token but the token has expired, needs to be replaced
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = await UserService.updateUser(
                    foundUser.username,
                    { refreshToken: foundUser.refreshToken }
                );
            }
            const decodedValue: UserPayload = decoded;
            if (err || foundUser.username !== decodedValue.username)
                return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        username: decodedValue.username,
                        roles: roles,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: "15m" }
            );

            const newRefreshToken = jwt.sign(
                { username: foundUser.username },
                process.env.REFRESH_TOKEN_SECRET!,
                { expiresIn: "15d" }
            );
            // saving refresh token for current user
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            await UserService.updateUser(foundUser.username, {
                refreshToken: foundUser.refreshToken,
            });

            // creates secure cookie with refreshToken
            res.cookie("jwt", newRefreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: "none",
                secure: true,
            });

            res.json({ roles, accessToken });
        }
    );

    // try {
    //     const payload = jwt.verify(
    //         refreshToken,
    //         process.env.REFRESH_TOKEN_SECRET!
    //     ) as UserPayload;

    //     if (foundUser.username !== payload?.username)
    //         return res.sendStatus(403);

    //     const roles = Object.values(foundUser.roles);
    //     const group_id = Object.values(foundUser.groupId || "");

    //     // new access token
    //     const accessToken = jwt.sign(
    //         {
    //             UserInfo: {
    //                 username: payload?.username,
    //                 roles: roles,
    //                 group_id: group_id,
    //             },
    //         },
    //         process.env.ACCESS_TOKEN_SECRET!,
    //         { expiresIn: "30m" }
    //     );
    //     console.log("here in refresh");
    //     res.status(200).json({ accessToken });
    // } catch (error) {
    //     console.log(error);
    //     return res.sendStatus(403);
    // }
};

export { handleRefreshToken };
