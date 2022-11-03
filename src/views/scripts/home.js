const socket = io();
console.log("axios", axios);

const api = axios.create({
  baseURL: "http://localhost:3000",
});

async function sessionStart() {
  const resp = await api.get("/session/start");
  console.log("start/", resp.data);
}

async function sessionStop() {
  const resp = await api.get("/session/stop");
  console.log("stop/", resp.data);
}

async function sessionLogout() {
  const resp = await api.get("/session/logout");
  console.log("logout/", resp.data);
}

async function sessionStatus() {
  const resp = await api.get("/session/status");
  console.log("status/", resp.data);
}

function updateQrCode({ code, attempts }) {
  if (code) {
    document.getElementById("qrcode").src = code;
    document.getElementById("attempts").innerText = attempts;
  }
}

function updateStatusSession(statusSession) {
  document.getElementById("statusSession").innerText = statusSession;
}
function updateDeviceInfo(data) {
  const { pushname, platform, phone, battery, connected } = data;
  console.log("updateDeviceInfo", pushname);
  document.getElementById("name").innerText = pushname;
}

function handleCommand(cmd) {
  socket.emit("command", cmd);
  console.log("handleCommand", cmd);
}

document.addEventListener("DOMContentLoaded", () => {
  socket.on("connect", () => {
    console.log("socket connected");
    socket.on("status", (data) => {
      const { qrCode, hostDevice, statusSession } = data;
      updateQrCode(qrCode);
      updateStatusSession(statusSession);
      updateDeviceInfo(hostDevice);
      console.log("status", data);
    });
    socket.on("qrCode", (data) => {
      console.log("qrCode change", data);
      const { code, attempts } = data;
      updateQrCode({ code, attempts });
    });
    socket.on("statusSession", (statusSession) => {
      console.log("statusSession", statusSession);
      updateStatusSession(statusSession);
    });
    socket.on("loadingScreen", ({ percent, message }) => {
      console.log("loadingScreen", { percent, message });
    });
    socket.on("wppConnected", (data) => {
      console.log("wppConnected", data);
      updateDeviceInfo(data);
    });

    socket.on("all", (data) => {
      console.log("on all", data);
    });

    socket.on("teste", (data) => {
      console.log("on teste", data);
    });
  });
});
