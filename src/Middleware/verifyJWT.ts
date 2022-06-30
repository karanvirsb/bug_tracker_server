import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

interface UserPayload {
    UserInfo: {
        username: String;
        roles: {};
        groupId: String;
    };
}

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];

    // unauthorized
    if (!authHeader) return next(new Error("Not authorized"));

    // Bearer token...
    const token = authHeader.split(" ")[1];
    try {
        // @tsignore
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
