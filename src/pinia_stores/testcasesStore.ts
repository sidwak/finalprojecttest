import { defineStore } from 'pinia'
import type { projectDataType, testcaseDataType } from '@/ts_types/puppet_test_types'
import type { FlowExportObject } from '@vue-flow/core'

export const useTestcasesStore = defineStore('testcasesStore', {
  state: () => ({
    testcasesList: <testcaseDataType[]>[],
    currentTestcase: <testcaseDataType>{
      id: -99,
      name: 'No Testcase',
    },
    newTestcaseId: 0,
    nodesFlowData: <FlowExportObject>{
      nodes: [],
      edges: [],
      position: [0, 0],
      zoom: 1,
      viewport: {
        x: 0,
        y: 0,
        zoom: 1,
      },
    },
    selectedNodeId: '-1',
    deleteNodeId: '-1',
  }),
  getters: {
    getCurrentTestcase: (state) => {
      return {
        id: state.currentTestcase.id,
        name: state.currentTestcase.name,
      } as testcaseDataType // can't directly return or else clone error
    },
    getNodesFlowData: (state) => {
      return {
        nodes: JSON.parse(JSON.stringify(state.nodesFlowData.nodes)),
        edges: JSON.parse(JSON.stringify(state.nodesFlowData.edges)),
        position: JSON.parse(JSON.stringify(state.nodesFlowData.position)),
        zoom: JSON.parse(JSON.stringify(state.nodesFlowData.zoom)),
        viewport: JSON.parse(JSON.stringify(state.nodesFlowData.viewport)),
      } as FlowExportObject
    },
  },
  actions: {
    setTestcaseInfoJsonData(newData: any) {
      this.testcasesList.length = 0
      this.newTestcaseId = 0
      newData.testCases.forEach((testcase: testcaseDataType) => {
        // here testcases is the array
        this.testcasesList.push(testcase)
        if (testcase.id >= this.newTestcaseId) {
          this.newTestcaseId = testcase.id + 1
        }
      })
    },
    addNewTestcaseInList(testcaseData: testcaseDataType) {
      this.testcasesList.push(testcaseData)
      this.newTestcaseId = testcaseData.id + 1
    },
    /* incrementNewTestcaseId() {
      this.testcasesList.forEach((testcase: testcaseDataType) => {
        console.log(`first ${testcase.id} second ${this.newTestcaseId}`)
        if (testcase.id === this.newTestcaseId) {
          this.currentTestcase = testcase
        }
      })
      console.log(this.currentTestcase)
      this.newTestcaseId += 1
    }, */
    setNewCurrentTestcase(testcaseId: number) {
      this.testcasesList.forEach((testcase: testcaseDataType) => {
        if (testcase.id === testcaseId) {
          this.currentTestcase = testcase
        }
      })
      if (testcaseId == -99) {
        this.currentTestcase = {
          id: -99,
          name: 'No Testcase',
        }
      }
    },
    setNodesFlowData(newData: FlowExportObject) {
      this.nodesFlowData = newData
    },
    deleteNodeWithId(nodeId: string) {
      this.deleteNodeId = nodeId
    },
    selectNodeWithId(nodeId: string) {
      this.selectedNodeId = nodeId
    },
  },
})
