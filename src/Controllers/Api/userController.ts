import UserService from "../../Services/Users";
import ProjectService from "../../Services/Projects";
import TicketService from "../../Services/Tickets";
import { NextFunction, Request, Response } from "express";
import { UserType, IUser } from "../../Model/Users";
import { ZodError } from "zod";
import axios from "axios";

const getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> => {
    const { filterValue, filter } = req.body;
    if (!filterValue) throw Error("Invalid parameter");

    try {
        const user: UserType | null = await UserService.getUser({
            filter: filter ?? "username",
            val: filterValue,
        });
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
        const user = await UserService.getUserByRefreshToken(token);

        if (!user) {
            return res.sendStatus(204);
        }

        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> => {
    const { users } = req.body;

    if (!users) return res.sendStatus(401);

    try {
        const foundUsers = await UserService.getAllUsers(users);

        if (!foundUsers) return res.sendStatus(204);

        return res.status(200).json(foundUsers);
    } catch (error) {
        next(error);
    }
};

const getUsersByGroupId = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> => {
    const { groupId } = req.body;

    if (!groupId) return res.sendStatus(401);

    try {
        const usersArr = await UserService.getUsersByGroupId(groupId);

        if (!usersArr) return res.sendStatus(204);

        return res.status(200).json(usersArr);
    } catch (error) {
        next(error);
    }
};

const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> => {
    const user: UserType = (req as any).body.user;
    // having predetermined colors for avatars
    const colors = [
        "d28100",
        "d1423f",
        "dc1677",
        "c233a0",
        "6163e1",
        "246db6",
        "008290",
        "7ba100",
        "9355d2",
        "627a89",
    ];

    try {
        // generate a random number for a color
        const color = colors[Math.floor(Math.random() * colors.length)];
        // fetching the avatar
        const response = await axios(
            `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=${color}&color=fff&length=2&rounded=true&bold=true&format=svg`,
            { method: "get" }
        );
        // adding avatar to user
        user["avatar"] = {
            data: response.data,
            contentType: "image/svg+xml",
        };
        // parse user to see if its correct
        await IUser.parseAsync(user);
        const newUser = await UserService.createUser(user);
        if (newUser) return res.sendStatus(200);

        return res.sendStatus(204); // if something goes wrong
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
        const deletedUser = await UserService.deleteUser(id);

        if (deletedUser) return res.sendStatus(200);
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id, updates } = req.body;
    const updatesKeys = Object.keys(updates);

    // looking for update keys and see if the exist in user
    for (let i = 0; i < updatesKeys.length; i++) {
        if (!IUser._getCached().keys.includes(updatesKeys[i])) {
            return res.status(400).json({
                message: `Update ${updatesKeys[i]} does not exist`,
            });
        }
    }
    try {
        const updatedUser = await UserService.updateUser(id, updates);

        if (updatedUser) return res.sendStatus(200);

        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

const removeUserFromGroup = async (
    req: Request<
        unknown,
        unknown,
        { username: string; groupId: string },
        unknown
    >,
    res: Response,
    next: NextFunction
) => {
    const { username, groupId } = req.body;

    try {
        // first find user
        const foundUser = await UserService.getUser({
            filter: "username",
            val: username,
        });

        if (!foundUser)
            return res.status(500).json({ error: "User was not found" });

        // then delete the groupId
        const updatedUser = await UserService.updateUser(username, {
            groupId: "",
            roles: { User: "2001" },
        });

        if (!updatedUser)
            return res.status(204).json({ error: "User could not be removed" });

        // then find all teh projects and remove that user
        const projects = await ProjectService.getProjectsByGroupIdNoPages(
            groupId
        );

        const projectPromises: Promise<any>[] = []; // storing the project promises
        const projectIds: string[] = []; // storing the projectIds

        if (projects) {
            // checking to see if the user is within the project
            for (let i = 0; i < projects.length; i++) {
                const project = projects[i];
                if (project.users && project.users.includes(username)) {
                    projectIds.push(project.projectId);

                    projectPromises.push(
                        ProjectService.removeUserFromProject(
                            project.projectId,
                            username
                        )
                    );
                }
            }
        }
        // if there are promises for projects then return that
        if (projectPromises) {
            Promise.all(projectPromises).catch(() => {
                return res
                    .status(500)
                    .json({ error: "Could not remove user from projects" });
            });
        }
        // promising all deletes for all the tickets
        for (let j = 0; j < projectIds?.length; j++) {
            Promise.all(await getTicketPromises(projectIds[j], username)).catch(
                () => {
                    return res
                        .status(500)
                        .json({ error: "Could not remove user from tickets" });
                }
            );
        }

        return res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};

const getTicketPromises = async (projectId: string, username: string) => {
    const ticketPromises: Promise<boolean>[] = [];
    const projectTickets = await TicketService.getAllTicketsByProjectId({
        projectId: projectId,
    });

    if (projectTickets) {
        projectTickets.forEach((ticket) => {
            if (ticket.reporterId === username) {
                ticketPromises.push(
                    TicketService.removeUserFromTicket(
                        ticket.ticketId,
                        username
                    )
                );
            } else if (
                ticket.assignedDev &&
                ticket?.assignedDev?.includes(username)
            ) {
                ticketPromises.push(
                    TicketService.removeUserFromTicket(
                        ticket.ticketId,
                        username
                    )
                );
            }
        });
    }

    return ticketPromises;
};

export {
    getUser,
    createUser,
    deleteUser,
    updateUser,
    getUserByRefreshToken,
    getAllUsers,
    getUsersByGroupId,
    removeUserFromGroup,
};
