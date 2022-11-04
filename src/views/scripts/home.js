const socket = io();

const api = axios.create({
  baseURL: "http://localhost:3000",
});

async function sessionStart() {
  try {
    const resp = await api.get("/session/start");
    console.log("start/", resp.data);
    toast("iniciando bot, aguarde.");
  } catch (error) {}
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
  return api.get("/session/status");
}

function updateQrCode({ code, attempts }) {
  if (code) {
    console.log("show qrcode");
    document.getElementById("qrcode").src = code;
    document.getElementById("attempts").innerText = attempts;
    document.getElementById("qrcode").style.visibility = "visible";
  } else {
    console.log("hidden qrcode");
    document.getElementById("qrcode").style.visibility = "hidden";
  }
}

function updateStatusSession(statusSession) {
  document.getElementById("statusSession").innerText = statusSession;
}
function updateDeviceInfo(data) {
  const { pushname, platform, phone, battery, connected, wppVersion } = data;
  console.log("updateDeviceInfo", pushname);
  document.getElementById("name").innerText = pushname || "";
  document.getElementById("platform").innerText = platform || "";
  document.getElementById("wppVersion").innerText = wppVersion || "";
}

function handleCommand(cmd) {
  socket.emit("command", cmd);
  console.log("handleCommand", cmd);
}

function toast(text) {
  Toastify({
    text: text,
    duration: 3000,
    newWindow: true,
    close: false,
    gravity: "bottom", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
  }).showToast();
}

document.addEventListener("DOMContentLoaded", () => {
  toast("teste toast");
  sessionStatus()
    .then((data) => {
      if (data.data?.status) {
        const { hostDevice, statusSession, qrCode } = data.data.status;
        updateDeviceInfo(hostDevice);
        updateStatusSession(statusSession);
        updateQrCode(qrCode);
      }
    })
    .catch((err) => {
      toast("status error");
      console.log("status err", err);
    });
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
