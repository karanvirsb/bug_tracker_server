import { NextFunction, Request, Response } from "express";

export {};
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./src/Config/corsOptions");
const credentials = require("./src/Middleware/credentials");
const cookieParser = require("cookie-parser");
const verifyJWT = require("./src/Middleware/verifyJWT");

// MIDDLEWARE
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

// ROUTES
app.use("/register", require("./src/Routes/register"));
app.use("/login", require("./src/Routes/login"));
app.use("/refresh", require("./src/Routes/refresh"));
app.use("/logout", require("./src/Routes/logout"));

app.use(verifyJWT);
// Protected routes
app.use("/user", require("./src/Routes/api/user"));

app.use((req: Request, res: Response, next: NextFunction) => {
    res.send(404).json({ error: "Not Found" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ error: err.message });
});

module.exports = app;
