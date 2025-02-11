const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    getComInfo: () => ipcRenderer.invoke('getComInfo'),
    getCpuUsage: () => ipcRenderer.invoke('getCpuUsage'),
    getUptime: () => ipcRenderer.invoke('getUptime'),
});