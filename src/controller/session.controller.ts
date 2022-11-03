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
      return res.status(200).json({ message: "wpp client does not exist" });
    }

    try {
      const close = wppBot.client.close();
      return res.status(200).json({ message: "wpp close session", close });
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

    if (!wppBot.client) {
      return res.status(200).json({ message: "wpp client does not exist" });
    }

    let isLoggedIn: any;

    try {
      isLoggedIn = await wppBot.client.isLoggedIn();
    } catch (error) {
      isLoggedIn = false;
    }

    if (!isLoggedIn) {
      return res.status(500).json({ message: "session is not loggedin" });
    }

    try {
      const loggedout = await wppBot.client.logout();
      return res.status(200).json({ message: "session loggedout", loggedout });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "could not loggedout", error: error.message });
    }
  }

  async status(req: Request, res: Response) {
    const { wppBot } = req;

    if (!wppBot) {
      return res.status(200).json({ message: "wpp intance does not exist" });
    }

    if (!wppBot.client) {
      return res.status(200).json({ message: "wpp client does not exist" });
    }

    let isConnected: any;
    let isLoggedIn: any;

    try {
      isConnected = await wppBot.client.isConnected();
    } catch (error) {
      isConnected = "session closed";
    }

    try {
      isLoggedIn = await wppBot.client.isLoggedIn();
    } catch (error) {
      isLoggedIn = "session closed";
    }

    return res
      .status(200)
      .json({ isConnected, isLoggedIn, statusSession: wppBot.statusSession });
  }
}
