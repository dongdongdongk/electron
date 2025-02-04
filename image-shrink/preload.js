const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getOutputPath: () => ipcRenderer.invoke('getOutputPath'),
  selectFile: () => ipcRenderer.invoke('dialog:selectFile'),
  minimizeImage: (options) => ipcRenderer.send('image:minimize', options),
  onImageDone: (callback) => ipcRenderer.on('image:done', callback)
});