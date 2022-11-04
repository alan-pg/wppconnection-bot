import { HostDevice } from "@wppconnect-team/wppconnect";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { Wpp } from "../wppBot";

export class SessionController {
  constructor() {}
  async start(req: Request, res: Response) {
    const { wppBot } = req;
    let isLoggedIn: boolean | undefined;

    try {
      if (wppBot.client) {
        isLoggedIn = await wppBot.client?.isLoggedIn();
      } else {
        isLoggedIn = false;
      }
    } catch (error) {
      isLoggedIn = false;
    }

    if (isLoggedIn) {
      return res.status(400).json({ message: "session already loggedin" });
    }

    try {
      wppBot.start("bot");
      return res.status(200).json({ message: "session starting" });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "start session failed", error: error.message });
    }
  }

  async stop(req: Request, res: Response) {
    console.log("stop");
    const { wppBot } = req;

    if (!wppBot) {
      return res.status(200).json({ message: "wpp intance does not exist" });
    }

    if (!wppBot.client) {
      console.log("client", wppBot.client);
      return res.status(200).json({ message: "wpp client does not exist" });
    }

    try {
      const closed = await wppBot.client.close();
      console.log(
        "🚀 ~ file: session.controller.ts ~ line 50 ~ SessionController ~ stop ~ close",
        closed
      );
      return res.status(200).json({ message: "wpp close session", closed });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "wpp close session error", error });
    }
  }

  async logout(req: Request, res: Response) {
    const { wppBot } = req;
    if (!wppBot) {
      return res.status(200).json({ message: "wpp intance does not exist" });
    }
    try {
      await wppBot.logout();
      return res.status(200).json({ message: "session logged out" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async status(req: Request, res: Response) {
    const { wppBot } = req;
    try {
      const status = await wppBot.getStatus();
      return res.status(200).json({ message: "sucess", status });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
