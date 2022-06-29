import { Server } from "socket.io";
const allowedOrigins = require("./src/Config/allowedOrigins");

const socketListen = (app: any) => {
    const io = new Server(app, {
        cors: { origin: allowedOrigins, credentials: true },
    });

    console.log("connection");

    io.on("connection", (socket) => {
        console.log(socket);
    });
};

export { socketListen };
