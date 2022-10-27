const socket = io();

function updateQrCode({ base64Qrimg, attempts }) {
  if (base64Qrimg) {
    document.getElementById("qrcode").src = base64Qrimg;
    document.getElementById("attempts").innerText = attempts;
  }
}

function updateStatusSession(statusSession) {
  document.getElementById("statusSession").innerText = statusSession;
}

function updateDeviceInfo(data) {
  const {
    wppVersion,
    batteryLevel,
    formattedTitle,
    displayName,
    imgUrl,
    isBusiness,
  } = data;
  console.log('updateDeviceInfo', displayName);
  document.getElementById("name").innerText = displayName;
  document.getElementById("wppNumber").innerText = formattedTitle;
  document.getElementById("wppVersion").innerText = wppVersion;
  document.getElementById("batteryLevel").innerText = batteryLevel;
}

function handleCommand(cmd){
    socket.emit('command', cmd)
    console.log('handleCommand', cmd);
}

document.addEventListener("DOMContentLoaded", () => {
  socket.on("connect", () => {
    console.log("socket connected");
    socket.on("status", (data) => {
      const { qrCode, deviceInfo, statusSession } = data;
      updateQrCode(qrCode);
      updateStatusSession(statusSession);
      updateDeviceInfo(deviceInfo);
      console.log("status", data);
    });
    socket.on("qrCode", ({ base64Qrimg, attempts }) => {
      console.log("qrCode change", attempts);
      updateQrCode({ base64Qrimg, attempts });
    });
    socket.on("statusSession", (statusSession) => {
      console.log("statusSession", statusSession);
      updateStatusSession(statusSession);
    });
    socket.on("wppConnected", (data) => {
      console.log("wppConnected", data);
    updateDeviceInfo(data); 
    });
  });
});
