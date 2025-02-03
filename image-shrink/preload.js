const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  selectPath: () => ipcRenderer.invoke('select-path'),
});