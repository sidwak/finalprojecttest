import { defineStore } from 'pinia'
import type { projectDataType, testcaseDataType } from '@/ts_types/puppet_test_types'
import type { FlowExportObject } from '@vue-flow/core'

export const useTestcasesStore = defineStore('testcasesStore', {
  state: () => ({
    testcasesList: <testcaseDataType[]>[],
    currentTestcase: <testcaseDataType>{
      id: -99,
      name: 'No Testcase',
      headless: false,
      waitTime: 0,
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
        headless: state.currentTestcase.headless,
        waitTime: state.currentTestcase.waitTime,
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
    generateUniqueNumber() {
      const timestamp = Date.now() // Get the current timestamp in milliseconds
      const randomSuffix = Math.floor(Math.random() * 1000) // Add a small random number to avoid collisions
      let uniqueNumber = timestamp + randomSuffix // Combine the timestamp with the random number
      uniqueNumber = uniqueNumber % 100000000 // Modulo 100000000 ensures the number is 8 digits or less
      return uniqueNumber
    },
    setTestcaseInfoJsonData(newData: any) {
      this.testcasesList.length = 0
      this.newTestcaseId = 0
      if (newData.testCases) {
        newData.testCases.forEach((testcase: testcaseDataType) => {
          // here testcases is the array
          this.testcasesList.push(testcase)
          /* if (testcase.id >= this.newTestcaseId) {
            this.newTestcaseId = testcase.id + 1
          } */
          this.newTestcaseId = this.generateUniqueNumber()
        })
      }
    },
    addNewTestcaseInList(testcaseData: testcaseDataType) {
      this.testcasesList.push(testcaseData)
      //this.newTestcaseId = testcaseData.id + 1
      this.newTestcaseId = this.generateUniqueNumber()
    },
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
          headless: false,
          waitTime: 0,
        }
      }
    },
    setNodesFlowData(newData: FlowExportObject | null) {
      if (newData !== null) {
        this.nodesFlowData = newData
      } else {
        this.nodesFlowData = {
          nodes: [],
          edges: [],
          position: [0, 0],
          zoom: 1,
          viewport: {
            x: 0,
            y: 0,
            zoom: 1,
          },
        }
      }
    },
    deleteNodeWithId(nodeId: string) {
      this.deleteNodeId = nodeId
    },
    selectNodeWithId(nodeId: string) {
      this.selectedNodeId = nodeId
    },
    setTestcaseHeadlessMode(hMode: boolean) {
      this.currentTestcase.headless = hMode
    },
    setTestcaseWaitTime(num: number) {
      this.currentTestcase.waitTime = num
    },
  },
})
