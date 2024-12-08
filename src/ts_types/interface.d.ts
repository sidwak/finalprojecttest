export interface ElectronAPI {
  invokeFunction: (args) => Promise<any>
  saveTestCase: (args) => Promise<any>
  loadTestCase: (args) => Promise<any>
  startTest: (args) => Promise<any>
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}
