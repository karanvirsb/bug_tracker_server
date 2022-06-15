require("dotenv");
const express = require("express");
const app = express();
const port = 8000;
const dbController = require("./src/Controllers/databaseController");
const mongoose = require("mongoose");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
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
