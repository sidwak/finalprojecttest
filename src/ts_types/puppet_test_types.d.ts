import type { FlowExportObject } from '@vue-flow/core'

export interface projectDataType {
  id: number
  name: string
  desc: string
}

export interface testcaseDataType {
  id: number
  name: string
  headless: boolean
  waitTime: number
}

export interface testcaseFlowDataType {
  testcaseData: testcaseDataType
  nodesData: FlowExportObject
}
