import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
    UserInfo: {
        username: string;
        roles: {};
        groupId: string;
    };
}

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    // unauthorized
    if (!authHeader) return next(new Error("Not authorized"));

    // Bearer token...
    const token = authHeader.split(" ")[1];
    try {
        // checking to see if the token has username, roles and groupId
        const payload = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!
        ) as UserPayload;
        (req as any).user = payload?.UserInfo.username;
        (req as any).roles = payload?.UserInfo.roles;
        (req as any).groupId = payload?.UserInfo.groupId;
        next();
    } catch (error) {
        return res.sendStatus(403); // could be tempered with
    }
};

export default verifyJWT;
