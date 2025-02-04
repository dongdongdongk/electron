const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getOutputPath: () => ipcRenderer.invoke('getOutputPath'),
  selectFile: () => ipcRenderer.invoke('dialog:selectFile')
});