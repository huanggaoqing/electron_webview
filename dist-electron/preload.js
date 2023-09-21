"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("$native", {
  send(event, args) {
    electron.ipcRenderer.sendToHost(event, args);
  },
  on(event, callback) {
    electron.ipcRenderer.on(event, callback);
  }
});
