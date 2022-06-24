const { Users } = require("../../Services/Users");
import { NextFunction, Request, Response } from "express";
import { resolve } from "path";
import { IUser } from "../Model/Users";

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;
    try {
        const user = await Users.getUser(id);
        if (!user) {
            return res.sendStatus(204);
        }
        return res.send(200).json(user);
    } catch (error) {
        next(error);
    }
};

const getUserByRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { token } = req.body;
    try {
        const user = await Users.getUserByRefreshToken(token);
        if (!user) {
            return res.sendStatus(204);
        }
        return res.send(200).json(user);
    } catch (error) {
        next(error);
    }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;
    try {
        const newUser = await Users.saveUser(user);
        if (newUser) return res.sendStatus(200);

        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;
    try {
        const deletedUser = await Users.deletedUser(id);

        if (deletedUser) return res.sendStatus(200);
        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id, updates } = req.body;
    try {
        const updateUser = await Users.updateUser(id, updates);

        if (updateUser) return res.sendStatus(200);

        return res.sendStatus(502);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUser,
    createUser,
    deleteUser,
    updateUser,
    getUserByRefreshToken,
};
