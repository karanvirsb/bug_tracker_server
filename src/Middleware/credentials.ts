import { NextFunction, Request, Response } from "express";

export = {};
const allowedOrigins = require("../Config/allowedOrigins");

const credentials = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.header("origin");
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Credentials", "true");
    }
    next();
};

module.exports = credentials;
