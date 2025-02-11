import { defineStore } from 'pinia'
import type { projectDataType, testcaseDataType } from '@/ts_types/puppet_test_types'
import type { FlowExportObject } from '@vue-flow/core'
import { useVueFlow, type ViewportTransform, type VueFlowStore } from '@vue-flow/core'

export const useFlowStore = defineStore('flowStore', {
  state: () => ({
    instanceId: <string>'',
    currentSelectedNodeId: '',
    /**
     * For notifying to update the nodes flow data in testcaseStore
     */
    updateCounter: Date.now(),
  }),
  actions: {
    setVueFlowInstance(instId: string) {
      this.instanceId = instId
    },
    setCurrentSelectedNodeId(nodeId: string) {
      this.currentSelectedNodeId = nodeId
    },
    /**
     * State updated are reflected in next tick, use await nextTick()
     * @param cc
     */
    setUpdateCounter(cc: number) {
      this.updateCounter = cc
    },
  },
})
