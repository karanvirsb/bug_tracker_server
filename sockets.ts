import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
const socketListen = (app: any) => {
    io = new Server(app, {
        cors: { origin: "http://localhost:3000" },
    });
};

const wrap = (middleware: any) => (socket: any, next: any) => {
    console.log(socket.request);
    middleware(socket.request, {}, next);
};

export { socketListen, io, wrap };
