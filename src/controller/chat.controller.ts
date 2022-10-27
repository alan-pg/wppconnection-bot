import { Request, Response } from "express";

export class ChatController {
  async sendText(req: Request, res: Response) {
    const { message, contactNumber } = req.body;
    console.log("body", { message, contactNumber });

    /* const sent = await wppBot.sendTextToContact({ message, contactNumber }); */

    return res.status(200).json({ message: "success", payload: "sent" });
  }
}
