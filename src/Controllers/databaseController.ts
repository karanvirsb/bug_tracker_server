export {};
const mongoose = require("mongoose");
const ckey = require("ckey");
const { Users } = require("../Model/Users");

function connect(): void {
    mongoose
        .connect(ckey.DATABASE_URL)
        .then(() => {
            console.log("running");
        })
        .catch((err: Error) => {
            console.log(err);
        });
}

function disconnect(): void {
    mongoose.disconnect();
}

module.exports = { connect, disconnect, Users };
