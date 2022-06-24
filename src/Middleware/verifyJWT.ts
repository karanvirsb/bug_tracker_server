import { NextFunction, Request, Response } from "express";
import { JwtPayload, VerifyErrors } from "jsonwebtoken";

const jwt = require("jsonwebtoken");

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];

    // unauthorized
    if (!authHeader) return res.sendStatus(401);

    // Bearer token...
    const token = authHeader.split(" ")[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err: VerifyErrors, decoded: JwtPayload) => {
            if (err) return res.sendStatus(403); // could be tempered with
            req.user = decoded.username;
            next();
        }
    );
};

module.exports = verifyJWT;
