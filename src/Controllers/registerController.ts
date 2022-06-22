import { Request, Response } from "express";
const { getUser, createUser } = require("./User/userController");

const bcrypt = require("bcrypt");

const handleNewUser = async (req: Request, res: Response) => {
    const { username, password, firstName, lastName, email } = req.body;

    if (!username || !password || !firstName || !lastName || !email) {
        return res.status(400).json({
            message:
                "Username, password, email, first and last name are required",
        });
    }

    try {
        const duplicateUser = await getUser(username);

        if (duplicateUser.data) {
            return res.sendStatus(409); // conflict
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = {
            username: username,
            password: hashPassword,
            firstName: firstName,
            lastName: lastName,
            email: email,
            roles: { User: 2001 },
            group_id: "",
            refreshToken: "",
        };

        const userAdded = await createUser(user);

        if (userAdded.success && userAdded.status === 200) {
            return res.sendStatus(201);
        } else {
            return res.sendStatus(userAdded.status);
        }
    } catch (err: any) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { handleNewUser };
export = { handleNewUser };
