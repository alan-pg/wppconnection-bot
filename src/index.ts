import { Message } from "@wppconnect-team/wppconnect";
import { Wpp } from "./wpp";

const wpp = new Wpp();

async function start() {
  await wpp.init("teste");
  wpp.on("onMessage", async (message: Message) => {
    console.log("recived message", message);
    if (message.body === "@bot") {
      await wpp.client?.sendText(message.from, "🤖 hopee!");
    }
  });
}
start();
