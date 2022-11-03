import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { Wpp } from "../wppBot";

export function isWppBotConnected(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { wppBot } = req;
  console.log("isWppBotConnected", wppBot.statusSession);
  next();
}
