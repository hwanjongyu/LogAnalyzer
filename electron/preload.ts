import { ipcRenderer, contextBridge } from 'electron'

// Expose Electron API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  openJsonDialog: () => ipcRenderer.invoke('open-json-dialog'),
  saveJsonDialog: (defaultName: string) => ipcRenderer.invoke('save-json-dialog', defaultName),
  writeFile: (filePath: string, content: string) => ipcRenderer.invoke('write-file', filePath, content),
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
})
