import type { testcaseDataType } from '@/ts_types/puppet_test_types'
import type { nodeData } from '@/ts_types/nodeType'
import { useToastStore } from '@/pinia_stores/toastStore'
import { useProjectsStore } from '@/pinia_stores/projectsStore'
import { useTestcasesStore } from '@/pinia_stores/testcasesStore'
import type { projectDataType } from '@/ts_types/puppet_test_types'
import { currentProject } from './projectService'
import { nextTick } from 'vue'

let toastStore: ReturnType<typeof useToastStore>
let projectsStore: ReturnType<typeof useProjectsStore>
let testcasesStore: ReturnType<typeof useTestcasesStore>
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

export function loadTestcaseData(testcaseData: testcaseDataType) {}

export function initializeTestcases() {
  loadTestcaseInfoJson()
}

export function initializeTestcaseService() {
  toastStore = useToastStore()
  projectsStore = useProjectsStore()
  testcasesStore = useTestcasesStore()
}
