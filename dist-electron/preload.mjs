"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  openFileDialog: () => electron.ipcRenderer.invoke("open-file-dialog"),
  openJsonDialog: () => electron.ipcRenderer.invoke("open-json-dialog"),
  saveJsonDialog: (defaultName) => electron.ipcRenderer.invoke("save-json-dialog", defaultName),
  writeFile: (filePath, content) => electron.ipcRenderer.invoke("write-file", filePath, content),
  readFile: (filePath) => electron.ipcRenderer.invoke("read-file", filePath)
});
