import { Request, Response } from "express";

export class ChatController {
  async sendText(req: Request, res: Response) {
    const { wppBot } = req;
    const { message, contactNumber } = req.body;

    try {
      const numberSTatus = await wppBot.client?.checkNumberStatus(
        contactNumber
      );

      if (!numberSTatus?.numberExists) {
        return res.status(400).json({ message: "The number does not exist" });
      }

      if (!numberSTatus.canReceiveMessage) {
        return res
          .status(400)
          .json({ message: "the number cannot receive message" });
      }

      const sent = await wppBot.client?.sendText(
        numberSTatus.id._serialized,
        message
      );
      
      return res.status(200).json({ message: "success", payload: sent });
    } catch (error: any) {
      console.log("error", error.message);
      return res.status(500).json({ message: "error", payload: error });
    }

    /* const sent = await wppBot.sendTextToContact({ message, contactNumber }); */
  }
}
