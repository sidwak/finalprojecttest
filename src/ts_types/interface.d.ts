import type { projectDataType } from '@/services/projectInfoService'

export interface ElectronAPI {
  invokeFunction: (args) => Promise<any>
  saveTestCase: (args) => Promise<any>
  loadTestCase: (args) => Promise<any>
  startTest: (args) => Promise<any>
  getProjectsInfoJson: (args) => Promise<any>
  createNewProject: (args: projectDataType) => Promise<any>
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}
