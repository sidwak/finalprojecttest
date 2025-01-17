import type { testcaseDataType, testcaseFlowDataType } from '@/ts_types/puppet_test_types'
import type { NodeType } from '@/ts_types/nodeType'
import { useToastStore } from '@/pinia_stores/toastStore'
import { useProjectsStore } from '@/pinia_stores/projectsStore'
import { useTestcasesStore } from '@/pinia_stores/testcasesStore'
import type { projectDataType } from '@/ts_types/puppet_test_types'
import { currentProject } from './projectService'
import { nextTick } from 'vue'
import { useVueFlow, type RemoveNodes } from '@vue-flow/core'

let toastStore: ReturnType<typeof useToastStore>
let projectsStore: ReturnType<typeof useProjectsStore>
let testcasesStore: ReturnType<typeof useTestcasesStore>
let vueFlowInstance: ReturnType<typeof useVueFlow>
let removeNodesFunc: RemoveNodes
export let currentTestcase: testcaseDataType | null = null

export function createNewTestCase(testcaseData: testcaseDataType) {
  if (currentProject === null) {
    toastStore.displayNewMessage({
      severity: 'error',
      summary: 'No Project Open',
      detail: 'Please open/create a project first',
      life: 3000,
    })
    return
  }
  const result = window.electron.createNewTestcase(testcaseData)
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
  toastStore.displayNewMessage({
    severity: 'success',
    summary: 'Testcase Opened',
    detail: currentTestcase.name + ' was opened was successfully',
    life: 3000,
  })
  // whether to set current in backend?
}

export async function deleteTestcase(testcaseData: testcaseDataType) {
  const copyData = JSON.parse(JSON.stringify(testcaseData))
  const result = await window.electron.deleteTestcase(copyData)
  console.log(result)
  testcasesStore.setNewCurrentTestcase(-99)
  await loadTestcaseInfoJson()
}

export async function saveTestcaseDataInBackend() {
  const testcaseSaveData: testcaseFlowDataType = {
    testcaseData: testcasesStore.getCurrentTestcase,
    nodesData: testcasesStore.getNodesFlowData,
  }
  //const result = await window.electron.saveTestCase(toObject())
  const result = await window.electron.saveTestCase(testcaseSaveData)
  return result
}

export function loadTestcaseData(testcaseData: testcaseDataType) {}

export function reloadTestcaseData() {}

export async function deleteNodeFromTestcase(nodeId: string) {
  // in use?
  console.log(`removing node ${nodeId}`)
  //const { removeNodes } = useVueFlow()
  //removeNodes(nodeId, true)
  testcasesStore.deleteNodeWithId(nodeId)
}

export function initializeTestcases() {
  loadTestcaseInfoJson()
}

export function initializeTestcaseService() {
  toastStore = useToastStore()
  projectsStore = useProjectsStore()
  testcasesStore = useTestcasesStore()
  //vueFlowInstance = useVueFlow()
  //const { removeNodes } = vueFlowInstance
  //removeNodesFunc = removeNodes
}
