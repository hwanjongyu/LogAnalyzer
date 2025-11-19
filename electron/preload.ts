import { ipcRenderer, contextBridge } from 'electron'

// Expose Electron API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  saveFileDialog: (defaultName: string) => ipcRenderer.invoke('save-file-dialog', defaultName),
  writeFile: (filePath: string, content: string) => ipcRenderer.invoke('write-file', filePath, content),
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
})
