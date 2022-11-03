import { isWppBotConnected } from "../middlewares/isWppBotConnected";

const { Router } = require("express");
const { ChatController } = require("../controller/chat.controller");

const chat = new ChatController();

const chatRoutes = Router();

chatRoutes.post("/send_text", isWppBotConnected, chat.sendText);

export { chatRoutes };
