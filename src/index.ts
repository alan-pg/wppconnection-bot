import "reflect-metadata";
import { container } from "tsyringe";
import { server, io } from "./server";
import { Wpp } from "./wppBot";

const port = 3000;

const wppBot = container.resolve(Wpp);

wppBot.start("bot");

io.on("connection", (socket) => {
  console.log("client connected");
  socket.emit("status", wppBot.getStatus());
  socket.on("command", (cmd) => {
    console.log('on cmd', cmd);
    switch (cmd) {
      case "start":
        wppBot.start("bot");
        break;
      case "stop":
        wppBot.stop();
        break
      case "restart":
        wppBot.restart();
        break;
      case "logout":
        wppBot.logout();
        break;
      default:
        console.log("cmd not found");
        break;
    }
  });
});

wppBot
  .on("qrCode", (data) => {
    io.emit("qrCode", data);
  })
  .on("statusSession", (data) => {
    console.log("emit statusSession", data);
    io.emit("statusSession", data);
  })
  .on("wppConnected", (data) => {
    io.emit("wppConnected", data);
  })
  .on("loadingScreen", (data) => {
    io.emit("loadingScreen", data);
  });

server.listen(port, () => console.log("bot started on port", port));
