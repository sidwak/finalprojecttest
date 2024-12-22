const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  invokeFunction: (args) => ipcRenderer.invoke('invoke-function', args),
  saveTestCase: (args) => ipcRenderer.invoke('save-tc-data', args),
  loadTestCase: (args) => ipcRenderer.invoke('load-tc-data', args),
  startTest: (args) => ipcRenderer.invoke('start-test', args),
})
