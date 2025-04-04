import { defineStore } from 'pinia'

export const useUtilsStore = defineStore('utilsStore', {
  state: () => ({
    settingsModalNotifier: <number>0,
    deleteNodeNotifier: <number>0,
    fitViewNotifier: <number>0,
    terminalClearNotifier: <number>0,
    rightMoveNotifier: <number>0,
    leftMoveNotifier: <number>0
  }),
  actions: {
    openSettingsModal(updater: number) {
      this.settingsModalNotifier = updater
    },
    checkDeleteNode(updater: number) {
      this.deleteNodeNotifier = updater
    },
    doFitView(updater: number) {
      this.fitViewNotifier = updater
    },
    clearTerminal(updater: number) {
      this.terminalClearNotifier = updater
    },
    moveToRightNode(updater: number){
      this.rightMoveNotifier = updater
    },
    moveToLeftNode(updater: number){
      this.leftMoveNotifier = updater
    }
  },
})
