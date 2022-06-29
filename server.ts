require("dotenv").config();
const port = 8000;
import { connect, disconnect } from "./src/Controllers/databaseController";
import mongoose from "mongoose";
import app from "./app";
import { createServer } from "http";
const httpServer = createServer(app);
import { socketListen } from "./sockets";

connect();

mongoose.connection.once("open", () => {
    socketListen(httpServer);

    httpServer.listen(port, () => {
        console.log("Listening on port " + port);
    });

    httpServer.on("beforeExit", () => {
        console.log("beforeExit");
        disconnect();
    });
});
