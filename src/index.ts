import "reflect-metadata";
import { container } from "tsyringe";
import { useBot } from "./middlewares/useWppBot";
import { routes } from "./routes";
import { server, io, app } from "./server";
import { Wpp } from "./wppBot";

const port = 3000;

const wppBot = container.resolve(Wpp);

app.use(useBot(wppBot));
app.use(routes)

//wppBot.start("bot");

io.on("connection", (socket) => {
  console.log("client connected");
  socket.emit("status", wppBot.getStatus());  
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
