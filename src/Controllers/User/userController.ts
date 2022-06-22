const { Users } = require("../../Services/Users");
import { IUser } from "../../Model/Users";

const getUser = async (id: string) => {
    try {
        const user = await Users.getUser(id);
        if (!user) {
            return { success: true, status: 204, data: [] };
        }
        return { success: true, status: 200, data: user[0] };
    } catch (error) {
        return { success: false, status: 500, data: [] };
    }
};

const getUserByRefreshToken = async (token: String) => {
    try {
        const user = await Users.getUserByRefreshToken(token);
        if (!user) {
            return { success: true, status: 204, data: [] };
        }
        return { success: true, status: 200, data: user[0] };
    } catch (error) {
        return { success: false, status: 500, data: [] };
    }
};

const createUser = async (user: IUser) => {
    try {
        const newUser = await Users.saveUser(user);
        if (newUser) return { success: true, status: 200, data: null };

        if (!newUser) return { success: false, status: 502, data: null };

        // anyhting else its an error
        return { success: false, status: 500, data: null };
    } catch (error) {
        return { success: false, status: 500, data: null };
    }
};

const deleteUser = async (id: string) => {
    try {
        const deletedUser = await Users.deletedUser(id);

        if (deletedUser) return { success: true, status: 200, data: null };
        if (!deletedUser) return { success: false, status: 502, data: null };

        // anything else like 500 is an error

        return { success: false, status: 500, data: null };
    } catch (error) {
        return { success: false, status: 500, data: null };
    }
};

const updateUser = async (id: String, updates: {}) => {
    try {
        const updateUser = await Users.updateUser(id, updates);

        if (updateUser) return { success: true, status: 200, data: null };
        if (!updateUser) return { success: false, status: 502, data: null };

        // anything else like 500 is an error

        return { success: false, status: 500, data: null };
    } catch (error) {
        return { success: false, status: 500, data: null };
    }
};

module.exports = {
    getUser,
    createUser,
    deleteUser,
    updateUser,
    getUserByRefreshToken,
};
