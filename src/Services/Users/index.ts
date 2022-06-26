import { Model } from "mongoose";

const User: typeof Model = require("../../Model/Users");
import UserService from "./user_service";

export default UserService(User);
