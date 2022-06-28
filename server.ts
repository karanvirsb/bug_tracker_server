require("dotenv").config();
const port = 8000;
const dbController = require("./src/Controllers/databaseController");
const mongoose = require("mongoose");
const app = require("./app");
const { createServer } = require("http");
const httpServer = createServer(app);
const { socketListen } = require("./sockets");

dbController.connect();

mongoose.connection.once("open", () => {
    socketListen(httpServer);

    httpServer.listen(port, () => {
        console.log("Listening on port " + port);
    });

    httpServer.on("beforeExit", () => {
        console.log("beforeExit");
        dbController.disconnect();
    });
});
