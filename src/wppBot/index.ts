import { singleton } from "tsyringe";
import { create, HostDevice, Whatsapp } from "@wppconnect-team/wppconnect";
import EventEmitter from "events";

type qrCode = {
  attempts: number;
  code: string | null;
};

@singleton()
export class Wpp extends EventEmitter {
  client: Whatsapp | null;
  isConnected: boolean;
  qrCode: qrCode;
  statusSession: string;
  hostDevice: HostDevice;

  constructor() {
    super();
    this.client = null;
    this.isConnected = false;
    this.qrCode = {
      attempts: 0,
      code: null,
    };
    this.statusSession = "not started";
    this.hostDevice = {} as HostDevice;
  }

  async start(sessionName: string) {
    this.emit("statusSession", "starting")
    const client = await create({
      session: sessionName,
      logQR: false,
      autoClose: 0,
      catchQR: (code, _, attempts) => {
        console.log("attempts", attempts);
        this.qrCode = { attempts, code };
        this.emit("qrCode", { attempts, code });
      },
      statusFind: (statusSession) => {
        console.log("statusSession, session", statusSession);
        this.statusSession = statusSession;
        this.emit("statusSession", statusSession);
      },
      onLoadingScreen: (percent, message) => {
        console.log("LOADING_SCREEN", percent, message);
        this.emit("loadingScreen", { percent, message });
      },
    });
    client.getHostDevice().then((data) => {
      console.log("getHostDevice", data);
      this.hostDevice = data;
      this.emit("wppConnected", data);
    });
    client.onMessage((message) => {
      this.emit("onMessage", message);
    });
    this.qrCode = {
      attempts: 0,
      code: null,
    };
    this.client = client;
  }

  async logout() {
    try {
      this.emit("statusSession", "logging out")
      const logout = await this.client?.logout();
      console.log("logout", logout);
      this.emit("statusSession", "closing session")
      const close = await this.client?.close();
      console.log("logout success", close);
    } catch (error) {
      console.log("logout error", error);
    } finally {
      this.client = null;
    }
  }

  async stop() {
    try {
      this.emit("statusSession", "closing session")
      const close = await this.client?.close();
      console.log("stop success", close);
    } catch (error) {
      console.log("stop error", error);
    } finally {
      this.client = null;
    }
  }

  async useHere(){
    try {
      
     
    } catch (error: any) {
      console.log('reload page error', error.message);
    }
  }

  async restart() {
    this.emit("statusSession", "restarting session")
    if (this.client) {
      try {
       /*  this.client.getConnectionState
        this.client.isConnected
        this.client.isLoggedIn
        this.client.isMultiDevice
        this.client.onStateChange
        this.client.onStreamChange
        this.client.session
        this.client.useHere */
        this.emit("statusSession", "closing session")
        await this.client.close();
      } catch (error) {
        console.log("restart close error", error);
      } finally {
        this.client = null;
      }
    }
    this.start("bot");
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      qrCode: this.qrCode,
      statusSession: this.statusSession,
      hostDevice: this.hostDevice,
    };
  }
}
