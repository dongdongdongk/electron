const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    getComInfo: () => ipcRenderer.invoke('getComInfo'),
});