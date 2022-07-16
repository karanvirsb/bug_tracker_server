import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
interface SocketData {
    username: string;
}

type roomUsers = {
    socketId: Set<string>;
    status: string;
};

// const usersOnline: roomUsers[] = [];
const rooms = new Map<string, Map<string, roomUsers>>();

const socketListen = (app: any) => {
    // TODO add redis backend for caching users in room
    const io = new Server<DefaultEventsMap, any, SocketData>(app, {
        cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
    });

    io.on("connection", (socket) => {
        socket.emit("connection", socket.id);

        socket.on("joinRoom", userJoinsRoom(socket));

        // invalidating query for all users
        socket.on("invalidateQuery", (data) => {
            console.log("invalidate", data);
            io.to(data.groupId).emit("invalidateData", data.queryName);
        });
    });
};

const wrap = (middleware: any) => (socket: any, next: any) => {
    console.log(socket.request);
    middleware(socket.request, {}, next);
};

function userJoinsRoom(
    socket: Socket<DefaultEventsMap, any, SocketData, any>
): (...args: any[]) => void {
    return (roomId, username) => {
        if (!roomId) {
            socket.emit("error", { message: "Room id was not given" });
        }

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
                // emit room data back
            } else {
                const user = users?.get(username);
                const userSockets = user?.socketId;
                if (users && userSockets && userSockets.size < 4) {
                    userSockets.add(socket.id);

                    users.set(username, user);
                    rooms.set(roomId, users);

                    socket.join(roomId);
                }
            }
        }
        socket.emit("roomJoined", socket.rooms.has(roomId));
    };
}
export { socketListen, wrap };
