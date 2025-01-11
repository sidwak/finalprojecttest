import type { FlowExportObject } from '@vue-flow/core'

export interface projectDataType {
  id: number
  name: string
  desc: string
}

export interface testcaseDataType {
  id: number
  name: string
}

export interface testcaseFlowDataType {
  testcaseData: testcaseDataType
  nodesData: FlowExportObject
}
