import { Router } from "express";
import { chatRoutes } from "./chat.routes";
import { pagesRoutes } from "./page.routes";

const routes = Router();

routes.use("/pages", pagesRoutes);
routes.use("/chat", chatRoutes);

export { routes };
