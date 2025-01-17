const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  invokeFunction: (args: any) => ipcRenderer.invoke('invoke-function', args),
  saveTestCase: (args: any) => ipcRenderer.invoke('save-tc-data', args),
  loadTestCase: (args: any) => ipcRenderer.invoke('load-tc-data', args),
  startTest: (args: any) => ipcRenderer.invoke('start-test', args),
  getProjectsInfoJson: (args: any) => ipcRenderer.invoke('get-projects-info-json', args),
  createNewProject: (args: any) => ipcRenderer.invoke('create-new-project', args),
  setNewCurrentProject: (args: any) => ipcRenderer.invoke('set-new-current-project', args),
  getTestcasesInfoJson: (args: any) => ipcRenderer.invoke('get-testcases-info-json', args),
  createNewTestcase: (args: any) => ipcRenderer.invoke('create-new-testcase', args),
  deleteTestcase: (args: any) => ipcRenderer.invoke('delete-testcase', args),
})
