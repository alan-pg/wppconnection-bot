import { Router } from "express";
import { SessionController } from "../controller/session.controller";

const sessionRoutes = Router();

const sessionController = new SessionController();

sessionRoutes.get("/start", sessionController.start);
sessionRoutes.get("/stop", sessionController.stop);
sessionRoutes.get("/logout", sessionController.logout);
sessionRoutes.get("/status", sessionController.status);

export { sessionRoutes };
