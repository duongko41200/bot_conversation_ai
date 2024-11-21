const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  startRecognition: () => ipcRenderer.invoke("start-recognition"),
});
navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then((stream) => {
    console.log("Microphone is working!");
    // Bắt đầu gọi script Python
  })
  .catch((err) => {
    console.error("Microphone access error:", err);
  });