import Users from "../../Services/Users";
import { NextFunction, Request, Response } from "express";
import { UserType, IUser } from "../../Model/Users";
import { ZodError } from "zod";

const getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> => {
    const { id } = req.body;
    try {
        const user = await Users.getUser(id);
        if (!user) {
            return res.sendStatus(204);
        }
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const getUserByRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> => {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);
    try {
        const user = await Users.getUserByRefreshToken(token);
        if (!user) {
            return res.sendStatus(204);
        }
        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> => {
    const { user } = req.body;
    try {
        IUser.parse(user);
        const newUser = await Users.createUser(user);
        if (newUser) return res.sendStatus(200);

        return res.sendStatus(502);
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;
    try {
        const deletedUser = await Users.deleteUser(id);

        if (deletedUser) return res.sendStatus(200);
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id, updates } = req.body;
    const updatesKeys = Object.keys(updates);
    try {
        for (let i = 0; i < updatesKeys.length; i++) {
            if (!IUser._getCached().keys.includes(updatesKeys[i])) {
                return res.status(400).json({
                    message: `Update ${updatesKeys[i]} does not exist`,
                });
            }
        }
        const updatedUser = await Users.updateUser(id, updates);

        if (updatedUser) return res.sendStatus(200);

        return res.sendStatus(204);
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
