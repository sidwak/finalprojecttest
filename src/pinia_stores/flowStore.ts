import { defineStore } from 'pinia'
import type { projectDataType, testcaseDataType } from '@/ts_types/puppet_test_types'
import type { FlowExportObject } from '@vue-flow/core'
import { useVueFlow, type ViewportTransform, type VueFlowStore } from '@vue-flow/core'

export const useFlowStore = defineStore('flowStore', {
  state: () => ({
    instanceId: <string>'',
  }),
  actions: {
    setVueFlowInstance(instId: string) {
      this.instanceId = instId
    },
  },
})
