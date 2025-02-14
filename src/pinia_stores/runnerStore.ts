import { defineStore } from 'pinia'

export enum EExeState {
  Normal,
  Warn,
  Success,
  Error,
}

export const useRunnerStore = defineStore('runnerStore', {
  state: () => ({
    curExecuted: {
      id: '-1',
      exeState: EExeState.Normal,
    },
    flowHighlightResetNotifier: <number>0,
  }),
  actions: {
    setCurExecuted(executedNodeData: any) {
      this.curExecuted = executedNodeData
    },
    resetFlowHighlight(updater: number) {
      this.flowHighlightResetNotifier = updater
    },
  },
})
