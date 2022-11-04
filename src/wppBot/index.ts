import { singleton } from "tsyringe";
import {
  create,
  HostDevice,
  Whatsapp,
  defaultLogger,
} from "@wppconnect-team/wppconnect";
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
    defaultLogger.level = "silly";
  }

  async start(sessionName: string) {
    this.emit("statusSession", "starting");
    const client = await create({
      session: sessionName,
      logQR: false,
      autoClose: 0,
      disableWelcome: true,
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
    this.qrCode = {
      attempts: 0,
      code: null,
    };
    this.emit("qrCode", this.qrCode);
    try {
      const hostDeviceInfo = await client.getHostDevice();
      const wppVersion = await client.getWAVersion();
      this.hostDevice = Object.assign(hostDeviceInfo, { wppVersion });
      this.emit("wppConnected", Object.assign(hostDeviceInfo, { wppVersion }));
    } catch (error: any) {
      console.log("hostDeviceInfo error", error.message);
    }

    client.waitForQrCodeScan(() => {
      console.log("waitForQrCodeScan");
    });
    client.onMessage((message) => {
      this.emit("onMessage", message);
    });
    this.client = client;
  }

  async logout() {
    let isLoggedIn = false;
    if (!this.client) {
      throw new Error("client not started");
    }

    try {
      isLoggedIn = await this.client.isLoggedIn();
    } catch (error: any) {
      throw new Error(`error ${error.message}`);
    }

    if (!isLoggedIn) {
      throw new Error("client is not loggedin");
    }
    try {
      this.emit("statusSession", "logging out");
      const logout = await this.client?.logout();
      console.log("logout", logout);
      this.emit("statusSession", "closing session");
      const close = await this.client?.close();
      console.log("close", close);
      this.emit("statusSession", "logged out");
      this.statusSession = "logged out";
    } catch (error) {
      console.log("logout error", error);
      this.emit("statusSession", "logged out failed");
      this.statusSession = "logged out failed";
      throw new Error("logout error");
    } finally {
      this.client = null;
      this.hostDevice = {} as HostDevice;
      this.isConnected = false;
      this.emit("wppConnected", {});
    }
  }

  async stop() {
    try {
      this.emit("statusSession", "closing session");
      const close = await this.client?.close();
      console.log("stop success", close);
    } catch (error) {
      console.log("stop error", error);
    } finally {
      this.client = null;
    }
  }

  async useHere() {
    try {
    } catch (error: any) {
      console.log("reload page error", error.message);
    }
  }

  async restart() {
    this.emit("statusSession", "restarting session");
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
        this.emit("statusSession", "closing session");
        await this.client.close();
      } catch (error) {
        console.log("restart close error", error);
      } finally {
        this.client = null;
      }
    }
    this.start("bot");
  }

  async getStatus() {
    let isConnected = false;
    let isLoggedIn = false;
    if (this.client) {
      try {
        isConnected = await this.client?.isConnected();
      } catch (error) {
        isConnected = false;
      }
      try {
        isLoggedIn = await this.client?.isLoggedIn();
      } catch (error) {
        isLoggedIn = false;
      }
    }

    return {
      isConnected,
      isLoggedIn,
      qrCode: this.qrCode,
      statusSession: this.statusSession,
      hostDevice: this.hostDevice,
    };
  }
}
