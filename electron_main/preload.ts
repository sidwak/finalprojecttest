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
  deleteProjectWithId: (args: any) => ipcRenderer.invoke('delete-project-with-id', args),
  updateTestcaseData: (args: any) => ipcRenderer.invoke('update-testcase', args),
  exitApp: (args: any) => ipcRenderer.invoke('exit-app', args),
  minimizeApp: (args: any) => ipcRenderer.invoke('minimize-app', args),
  maximizeApp: (args: any) => ipcRenderer.invoke('maximize-app', args),
})
