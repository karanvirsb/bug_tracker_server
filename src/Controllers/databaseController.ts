export {};
const mongoose = require("mongoose");
const ckey = require("ckey");
const { Users } = require("../Model/Users");
import { IUser } from "../Model/Users";
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

async function getUser(id: String): Promise<IUser | []> {
    try {
        // to check if its an email
        if (id.includes("@")) {
            return await Users.find({ email: id }).exec();
        }
        return await Users.find({ username: id }).exec();
    } catch (error) {
        return [];
    }
}

async function saveUser(user: IUser): Promise<Boolean> {
    try {
        return Users.create(user) ? true : false;
    } catch (error) {
        return false;
    }
}

module.exports = { connect, disconnect, getUser, saveUser };
