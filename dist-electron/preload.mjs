"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  openFileDialog: () => electron.ipcRenderer.invoke("open-file-dialog"),
  saveFileDialog: (defaultName) => electron.ipcRenderer.invoke("save-file-dialog", defaultName),
  writeFile: (filePath, content) => electron.ipcRenderer.invoke("write-file", filePath, content),
  readFile: (filePath) => electron.ipcRenderer.invoke("read-file", filePath)
});
