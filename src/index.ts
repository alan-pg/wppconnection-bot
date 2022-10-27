import "reflect-metadata";
import { container } from "tsyringe";
import { server, io } from "./server";
import { Wpp } from "./wppBot";
import { WppSocket } from "./wppSocket";

const port = 3000;

const wppBot = container.resolve(Wpp);

const wppSocket = new WppSocket();

wppBot.init('teste')

io.on("connection", wppSocket.connection);

server.listen(port, () => console.log("bot started on port", port));
