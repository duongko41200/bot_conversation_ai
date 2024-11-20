const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  startRecognition: () => ipcRenderer.invoke("start-recognition"),
});
