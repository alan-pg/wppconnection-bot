import { NextFunction, Request, Response } from "express";
import { Wpp } from "../wppBot";

export function useBot(wppBot: Wpp) {
  console.log("use bot", wppBot.statusSession);
  const addBot = (req: Request, res: Response, next: NextFunction) => {
    req.wppBot = wppBot;
    next()
  };
  return addBot;
}
