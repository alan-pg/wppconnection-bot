import { Socket } from "socket.io";
import { container } from "tsyringe";
import { Wpp } from "../wppBot";

export class WppSocket {
  constructor() {
  }
  
  async connection(socket: Socket) {
    const wpp = container.resolve(Wpp);
    console.log("socket connected", wpp.statusSession);
  }
}
