require("dotenv");
const express = require("express");
const app = express();
const port = 8000;
const dbController = require("./src/Controllers/databaseController");
const mongoose = require("mongoose");
const cors = require("cors");
const corsOptions = require("./src/Config/corsOptions");
const credentials = require("./src/Middleware/credentials");

// MIDDLEWARE
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ROUTES

app.use("/register", require("./src/Controllers/registerHandler"));

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
