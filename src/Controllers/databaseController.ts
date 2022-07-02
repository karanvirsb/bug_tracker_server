import mongoose from "mongoose";

function connect(): void {
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === undefined) {
        mongoose
            .connect("mongodb://localhost:27017/bugTracker_development")
            .then(() => {
                console.log("running");
            })
            .catch((err: Error) => {
                console.log(err);
            });
    } else {
        mongoose
            .connect(process?.env?.DATABASE_URL ?? "")
            .then(() => {
                console.log("running");
            })
            .catch((err: Error) => {
                console.log(err);
            });
    }
}

function disconnect(): void {
    mongoose.disconnect();
}

export { connect, disconnect };
