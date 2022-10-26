import { create, Whatsapp } from "@wppconnect-team/wppconnect";
import EventEmitter from "events";

type qrCode = {
  attemps: number;
  code: string | null;
};

export class Wpp extends EventEmitter {
  client: Whatsapp | null;
  qrCode: qrCode;
  statusSession: string;

  constructor() {
    super();
    this.client = null;
    this.qrCode = {
      attemps: 0,
      code: null,
    };
    this.statusSession = "not started";
  }

  async init(sessionName: string) {
    const client = await create({
      session: sessionName,
      catchQR: (code, _, attemps) => {
        console.log("attemps", attemps);
        this.qrCode = { attemps, code };
        this.emit("qrCode"), { attemps, code };
      },
      statusFind: (statusSession, session) => {
        console.log("statusSession, session", statusSession, session);
        this.statusSession = statusSession;
        this.emit("statusSession", statusSession);
      },
      onLoadingScreen: (percent, message) => {
        console.log("LOADING_SCREEN", percent, message);
        this.emit("loadingScreen", { percent, message });
      },
    });
    client.onMessage((message) =>{
        this.emit('onMessage', message)
    })
    this.client = client;
  }
}
