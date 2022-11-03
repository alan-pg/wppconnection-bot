import { Router } from "express";
import { chatRoutes } from "./chat.routes";
import { pagesRoutes } from "./page.routes";
import { sessionRoutes } from "./session.routes";

const routes = Router();

routes.use("/pages", pagesRoutes);
routes.use("/chat", chatRoutes);
routes.use("/session", sessionRoutes);

export { routes };
