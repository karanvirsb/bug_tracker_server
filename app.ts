import { Express, NextFunction, Request, Response } from "express";

import express from "express";
const app: Express = express();
import cors from "cors";
import corsOptions from "./src/Config/corsOptions";
import credentials from "./src/Middleware/credentials";
import cookieParser from "cookie-parser";
import verifyJWT from "./src/Middleware/verifyJWT";
import {
    registerRouter,
    loginRouter,
    refreshRouter,
    logoutRouter,
    userRouter,
    groupRouter,
    projectRouter,
    ticketRouter,
    commentRouter,
} from "./src/Routes";
import { io, wrap } from "./sockets";
// MIDDLEWARE
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

// ROUTES
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/refresh", refreshRouter);
app.use("/logout", logoutRouter);

app.use(verifyJWT);

io?.on("connection", () => {
    console.log("user connected");
});

// Protected routes
app.use("/user", userRouter);
app.use("/group", groupRouter);
app.use("/project", projectRouter);
app.use("/ticket", ticketRouter);
app.use("/comment", commentRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: "Not Found" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err.message);
    res.status(500).json({ error: err.message });
});

export default app;
