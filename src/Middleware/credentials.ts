import { NextFunction, Request, Response, RequestHandler } from "express";

const allowedOrigins = require("../Config/allowedOrigins");

const credentials: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const origin = req.header("origin");
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Credentials", "true");
    }
    next();
};

module.exports = credentials;
