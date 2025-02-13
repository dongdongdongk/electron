const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    getComInfo: () => ipcRenderer.invoke('getComInfo'),
    getCpuUsage: () => ipcRenderer.invoke('getCpuUsage'),
    getUptime: () => ipcRenderer.invoke('getUptime'),

    // 이벤트 리스너 추가 (렌더러에서 `on` 메서드 사용 가능)
    on: (channel, callback) => {
        ipcRenderer.on(channel, (event, data) => callback(data));
    },

    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    }
});