import { Request, Response } from "express";

export class PagesController {
  login(req: Request, res: Response) {
    console.log("login");
    res.render("pages/login");
  }

  home(req: Request, res: Response) {
    res.render("pages/home");
  }

  auth(req: Request, res: Response) {
    console.log('req',req.body);
    const { username, password } = req?.body;
    if (username === "teste" && password === "teste") {
      res.redirect("/pages/home");
    } else {
      res.send("Usuário ou senha inválido!").end();
    }
  }
}
