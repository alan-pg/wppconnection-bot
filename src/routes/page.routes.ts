import { Router } from "express";
import { PagesController } from "../controller/pages.controller";

const pagesRoutes = Router();

const pagesController = new PagesController();

pagesRoutes.get("/", pagesController.login);

pagesRoutes.get("/home", pagesController.home);

pagesRoutes.post("/auth", pagesController.auth);

export { pagesRoutes };
