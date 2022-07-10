import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
const socketListen = (app: any) => {
    io = new Server(app, {
        cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
    });

    io.on("connection", (socket) => {
        socket.emit("connection", socket.id);
        socket.on("joinRoom", (roomId) => {
            console.log(
                "🚀 ~ file: sockets.ts ~ line 12 ~ socket.on ~ roomId",
                roomId
            );

            if (!roomId) {
                socket.emit("error", { message: "Room id was not given" });
            }
            socket.join(roomId);
        });

        // invalidating query for all users
        socket.on("invalidateQuery", (data) => {
            console.log(
                "🚀 ~ file: sockets.ts ~ line 19 ~ socket.on ~ data",
                data
            );
            io.sockets.to(data.groupId).emit("invalidateData", data.queryName);
        });
    });
};

const wrap = (middleware: any) => (socket: any, next: any) => {
    console.log(socket.request);
    middleware(socket.request, {}, next);
};

export { socketListen, io, wrap };
