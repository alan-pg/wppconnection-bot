import { Wpp } from "../../wppBot";

declare global{
  namespace Express {
      interface Request {
          wppBot: Wpp
      }
  }
}
