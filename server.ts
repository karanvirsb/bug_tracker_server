require("dotenv").config();
const port = 8000;
const dbController = require("./src/Controllers/databaseController");
const mongoose = require("mongoose");
const app = require("./app");

dbController.connect();

mongoose.connection.once("open", () => {
    console.log("open");
    app.listen(port, () => {
        console.log("Listening on port " + port);
    });

    app.on("beforeExit", () => {
        console.log("beforeExit");
        dbController.disconnect();
    });
});
