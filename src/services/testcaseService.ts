import type { testcaseDataType, testcaseFlowDataType } from '@/ts_types/puppet_test_types'
import type { flowNode, NodeType } from '@/ts_types/nodeType'
import { useToastStore } from '@/pinia_stores/toastStore'
import { useProjectsStore } from '@/pinia_stores/projectsStore'
import { useTestcasesStore } from '@/pinia_stores/testcasesStore'
import { useFlowStore } from '@/pinia_stores/flowStore'
import type { projectDataType } from '@/ts_types/puppet_test_types'
import { currentProject } from './projectService'
import { nextTick, watch } from 'vue'
import { useVueFlow, type RemoveNodes } from '@vue-flow/core'
import { io } from 'socket.io-client'
import { EExeState, useRunnerStore } from '@/pinia_stores/runnerStore'
import { useUtilsStore } from '@/pinia_stores/utilsStore'

let toastStore: ReturnType<typeof useToastStore>
let projectsStore: ReturnType<typeof useProjectsStore>
let testcasesStore: ReturnType<typeof useTestcasesStore>
let flowStore: ReturnType<typeof useFlowStore>
let runnerStore: ReturnType<typeof useRunnerStore>
let utilsStore: ReturnType<typeof useUtilsStore>
let vueFlowInstance: ReturnType<typeof useVueFlow>

const socket = io('ws://localhost:3000')

export let currentTestcase: testcaseDataType | null = null

export async function createNewTestCase(testcaseData: testcaseDataType) {
  if (currentProject === null) {
    toastStore.displayNewMessage({
      severity: 'error',
      summary: 'No Project Open',
      detail: 'Please open/create a project first',
      life: 3000,
    })
    return
  }
  const result = await window.electron.createNewTestcase(testcaseData)
  console.log(result)
  testcasesStore.addNewTestcaseInList(testcaseData)
  //testcasesStore.incrementNewTestcaseId()
  toastStore.displayNewMessage({
    severity: 'success',
    summary: 'Testcase Created',
    detail: testcaseData.name + ' was created was successfully',
    life: 3000,
  })
  loadNewTestcase(testcaseData.id)
}
async function loadTestcaseInfoJson() {
  const projectData: projectDataType = {
    id: projectsStore.currentProject.id,
    name: projectsStore.currentProject.name,
    desc: projectsStore.currentProject.desc,
  }
  const result = await window.electron.getTestcasesInfoJson(projectData)
  console.log(result)
  testcasesStore.setTestcaseInfoJsonData(result)
}

export async function loadNewTestcase(testcaseId: number) {
  await nextTick()
  testcasesStore.setNewCurrentTestcase(testcaseId)
  // after testcase loaded
  currentTestcase = testcasesStore.currentTestcase
  if (testcaseId !== -99) {
    toastStore.displayNewMessage({
      severity: 'success',
      summary: 'Testcase Opened',
      detail: currentTestcase.name + ' was opened was successfully',
      life: 3000,
    })
  }
  // whether to set current in backend?
}

export async function getTestcaseFlowData(testcaseData: testcaseDataType) {
  return await window.electron.loadTestCase(testcaseData)
}

export async function deleteTestcase(testcaseData: testcaseDataType) {
  const copyData = JSON.parse(JSON.stringify(testcaseData)) // why JSON parsing here?
  const result = await window.electron.deleteTestcase(copyData)
  console.log(result)
  if (testcaseData.id === testcasesStore.getCurrentTestcase.id) {
    testcasesStore.setNewCurrentTestcase(-99)
  }
  await loadTestcaseInfoJson()
}

export async function updateTestcase(testcaseData: testcaseDataType) {
  const updatedData: testcaseDataType = {
    id: testcaseData.id,
    name: testcaseData.name,
    headless: testcaseData.headless,
    waitTime: testcaseData.waitTime,
  }
  const result = await window.electron.updateTestcaseData(updatedData)
  console.log(result)
  await loadTestcaseInfoJson()
}

export async function saveTestcaseDataInBackend(oldTestcase?: testcaseFlowDataType) {
  resetAllNodesExecutionState()
  let testcaseSaveData: testcaseFlowDataType = {
    testcaseData: testcasesStore.getCurrentTestcase,
    nodesData: testcasesStore.getNodesFlowData,
  }
  if (oldTestcase) {
    testcaseSaveData.testcaseData = oldTestcase.testcaseData
    testcaseSaveData.nodesData = oldTestcase.nodesData
  }
  //const result = await window.electron.saveTestCase(toObject())
  const result = await window.electron.saveTestCase(testcaseSaveData)
  return result
}

export function loadTestcaseData(testcaseData: testcaseDataType) {}

export function reloadTestcaseData() {}

export async function deleteNodeFromTestcase(nodeId: string) {
  // in use?
  toastStore.displayNewMessage({
    severity: 'success',
    summary: 'Node Deleted',
    detail: `Node: ${nodeId} was deleted was successfully`,
    life: 3000,
  })
  console.log(`removing node ${nodeId}`)
  //const { removeNodes } = useVueFlow()
  //removeNodes(nodeId, true)
  testcasesStore.deleteNodeWithId(nodeId)
}

export async function startTestInBackend() {
  toastStore.displayNewMessage({
    severity: 'success',
    summary: 'Test Started',
    detail: 'Succesfully',
    life: 3000,
  })
  flowStore.setUpdateCounter(Date.now())
  resetAllNodesExecutionState()
  utilsStore.doFitView(Date.now())
  await nextTick()
  const saveResult = await saveTestcaseDataInBackend()
  console.log(testcasesStore.getCurrentTestcase)
  const result = await window.electron.startTest(testcasesStore.getCurrentTestcase)
}

export function initializeTestcases() {
  loadTestcaseInfoJson()
}

export function initializeTestcaseService() {
  toastStore = useToastStore()
  projectsStore = useProjectsStore()
  testcasesStore = useTestcasesStore()
  flowStore = useFlowStore()
  runnerStore = useRunnerStore()
  utilsStore = useUtilsStore()
  watch(
    () => runnerStore.curExecuted,
    (newVal, oldVal) => {
      setNodeExecutionState(newVal.id, newVal.exeState)
      if (oldVal.id !== '-1') {
        setEdgeExecutionState(oldVal.id, newVal.id, newVal.exeState)
      }
    },
  )
  watch(
    () => flowStore.instanceId,
    (newVal, oldVal) => {
      vueFlowInstance = useVueFlow(newVal)
    },
  )
  watch(
    () => utilsStore.terminalClearNotifier,
    (newVal, oldVal) => {
      resetAllNodesExecutionState()
    },
  )
  //vueFlowInstance = useVueFlow()
  //const { removeNodes } = vueFlowInstance
  //removeNodesFunc = removeNodes
}

function setNodeExecutionState(id: string, exeState: EExeState) {
  vueFlowInstance.updateNodeData(id, { exeState: exeState })
}
function setEdgeExecutionState(nodePrevId: string, nodeNextId: string, exeState: EExeState) {
  const edgeId = `from-${nodePrevId}:flow-next=>${nodeNextId}:flow-prev`
  vueFlowInstance.updateEdgeData(edgeId, { exeState: exeState })
}
export function resetAllNodesExecutionState() {
  vueFlowInstance.nodes.value.forEach((node) => {
    node.data.exeState = EExeState.Normal
  })
  vueFlowInstance.edges.value.forEach((edge) => {
    edge.data.exeState = EExeState.Normal
  })
}

socket.on('runnerExecr', (data) => {
  const executedNodeData = JSON.parse(data.message)
  runnerStore.setCurExecuted(executedNodeData)
})
