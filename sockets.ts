import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
interface SocketData {
    username: string;
}

const socketListen = (app: any) => {
    // TODO add redis backend for caching users in room
    const io = new Server<DefaultEventsMap, any, SocketData>(app, {
        cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
    });

    io.on("connection", (socket) => {
        socket.emit("connection", socket.id);

        socket.on("joinRoom", (roomId, username) => {
            if (!roomId) {
                socket.emit("error", { message: "Room id was not given" });
            }
            // check if user is already in room;

            // if not then add user to room
            socket.data.username = username;
            socket.join(roomId);
            socket.emit("roomJoined", socket.rooms.has(roomId));
        });

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

export { socketListen, wrap };
