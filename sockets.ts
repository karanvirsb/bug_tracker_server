import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
interface SocketData {
    username: string;
}

type roomUsers = {
    socketId: Set<string>;
    status: string;
};

const rooms = new Map<string, Map<string, roomUsers>>();

const socketListen = (app: any) => {
    // TODO add redis backend for caching users in room
    const io = new Server<DefaultEventsMap, any, SocketData>(app, {
        cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
    });

    io.on("connection", (socket) => {
        socket.emit("connection", socket.id);

        socket.on("ping", () => {
            socket.emit("echo");
        });

        socket.on("joinRoom", userJoinsRoom(socket));

        socket.on("leaveRoom", ({ roomId, username }) => {
            const roomMembers = rooms.get(roomId);
            roomMembers?.delete(username);
            // console.log(`${username} is leaving room ${roomId}`);
            socket.leave(roomId);
        });

        // invalidating query for all users
        socket.on("invalidateQuery", (data) => {
            io.to(data.groupId).emit("invalidateData", data.queryName);
        });

        socket.on("deleteCommentFromState", (data) => {
            io.to(data.roomId).emit("deleteComment", {
                comment: data.comment,
            });
        });

        socket.on("invalidateCommentsPage", (data) => {
            io.to(data.roomId).emit("invalidateCommentPage", {
                page: data.page,
                queryName: data.queryName,
            });
        });

        socket.on("leavingPage", () => {
            for (const [key] of socket.rooms.entries()) {
                // console.log(`Deleting ${socket.data.username} from ${key}`);
                const roomMembers = rooms.get(key);
                roomMembers?.delete(socket.data.username);
            }
        });

        socket.on("updateUserRoles", updateUserRoles(socket));

        socket.on("removedUserFromGroup", removeUserFromGroup(socket));
    });
};

const wrap = (middleware: any) => (socket: any, next: any) => {
    // console.log(socket.request);
    middleware(socket.request, {}, next);
};

function removeUserFromGroup(
    socket: Socket<DefaultEventsMap, any, SocketData, any>
): (...args: any[]) => void {
    return ({ username, roomId }) => {
        const room = rooms.get(roomId);

        if (!room) socket.emit("error", { message: "RoomId does not exist" });

        const user = room?.get(username);

        if (user) {
            socket.to([...user.socketId].pop() ?? "").emit("removedFromGroup");
        }
    };
}

function userJoinsRoom(
    socket: Socket<DefaultEventsMap, any, SocketData, any>
): (...args: any[]) => void {
    return ({ roomId, username }) => {
        // console.log(
        //     "🚀 ~ file: sockets.ts ~ line 56 ~ return ~ roomId, username",
        //     roomId,
        //     username
        // );

        if (!roomId) {
            socket.emit("error", { message: "Room id was not given" });
        }

        socket.data.username = username;

        // check if user is already in room;
        // if not then add user to room
        if (!rooms.has(roomId)) {
            const users = new Map<string, roomUsers>();
            users.set(username, {
                socketId: new Set<string>().add(socket.id),
                status: "online",
            });

            rooms.set(roomId, users);

            socket.join(roomId);
            // console.log(
            //     `line 81: added user: ${username} to room: ${roomId}, room has: ${socket.rooms.has(
            //         roomId
            //     )}`
            // );
            socket.emit("roomJoined", socket.rooms.has(roomId));
            // emit room data back
        } else {
            const users = rooms.get(roomId);

            if (users && !users.has(username)) {
                users.set(username, {
                    socketId: new Set<string>().add(socket.id),
                    status: "online",
                });
                rooms.set(roomId, users);

                socket.join(roomId);
                // console.log(
                //     `line 95: added user: ${username} to room: ${roomId} , room has: ${socket.rooms.has(
                //         roomId
                //     )}`
                // );
            }
        }
        // emit room data back
        socket.emit("roomJoined", socket.rooms.has(roomId));
    };
}

type updateUserRoles = {
    roomId: string;
    username: string;
    roles: { [key: string]: string };
};

function updateUserRoles(
    socket: Socket<DefaultEventsMap, any, SocketData, any>
): (...args: any[]) => void {
    return ({ roomId, username, roles }: updateUserRoles) => {
        // console.log(
        //     "🚀 ~ file: sockets.ts ~ line 143 ~ return ~ roomId, username, roles",
        //     roomId,
        //     username,
        //     roles
        // );
        const room = rooms.get(roomId);
        if (!room) {
            socket.emit("error", { message: "Invalid Room" });
        }

        const user = room?.get(username);
        if (user) {
            // console.log(
            //     "🚀 ~ file: sockets.ts ~ line 150 ~ return ~ user",
            //     user
            // );

            socket
                .to([...user.socketId].pop() ?? "")
                .emit("updateRoles", { roles: roles });
        }
    };
}
export { socketListen, wrap };
