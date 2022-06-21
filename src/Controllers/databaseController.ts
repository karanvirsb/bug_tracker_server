const mongoose = require("mongoose");
const Users = require("../Model/Users");

function connect(): void {
    mongoose
        .connect(process.env.DATABASE_URL)
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

export { connect, disconnect, Users };
