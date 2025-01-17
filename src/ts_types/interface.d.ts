import type { projectDataType } from '@/services/projectService'
import type { testcaseDataType } from './puppet_test_types'

export interface ElectronAPI {
  invokeFunction: (args) => Promise<any>
  saveTestCase: (args) => Promise<any>
  loadTestCase: (args) => Promise<any>
  startTest: (args: testcaseDataType) => Promise<any>
  getProjectsInfoJson: (args) => Promise<any>
  createNewProject: (args: projectDataType) => Promise<any>
  setNewCurrentProject: (args: projectDataType) => Promise<any>
  getTestcasesInfoJson: (args: projectDataType) => Promise<any>
  createNewTestcase: (args: testcaseDataType) => Promise<any>
  deleteTestcase: (args: testcaseDataType) => Promise<any>
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}
