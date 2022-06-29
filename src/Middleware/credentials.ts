import { NextFunction, Request, Response, RequestHandler } from "express";

import allowedOrigins from "../Config/allowedOrigins";

const credentials: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Used to check origins if credentials and origin is there
    const origin = req.header("origin") || "";
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Credentials", "true");
    }
    next();
};

export default credentials;
