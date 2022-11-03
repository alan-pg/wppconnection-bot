import http from "http";
import path from "path";
import express from "express";
import session from "express-session";
import socketio from "socket.io";
import { renderFile } from "ejs";
import { routes } from "./routes";

const app = express();

const server = http.createServer(app);

const io = new socketio.Server(server);

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/views")));

app.set("views", path.join(__dirname, "views"));

app.engine("html", renderFile);

app.set("view engine", "html");

export { server, app, io };
