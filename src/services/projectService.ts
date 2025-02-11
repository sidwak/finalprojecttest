export let isInitialized: boolean = false
import { useProjectsStore } from '@/pinia_stores/projectsStore'
import type { projectDataType } from '@/ts_types/puppet_test_types'
import { useToastStore } from '@/pinia_stores/toastStore'
import { initializeTestcases, loadNewTestcase } from './testcaseService'
import { useTestcasesStore } from '@/pinia_stores/testcasesStore'

// :any = undefined
let projectsStore: ReturnType<typeof useProjectsStore>
let toastStore: ReturnType<typeof useToastStore>
let testcaseStore: ReturnType<typeof useTestcasesStore>
export let currentProject: projectDataType | null = null

async function loadProjectInfoJson() {
  const result = await window.electron.getProjectsInfoJson('hello')
  console.log(result)
  projectsStore.setProjectsInfoJsonData(result)
}

export async function createNewProject(projectData: projectDataType) {
  const result = await window.electron.createNewProject(projectData) // was not using await here why?
  console.log(result)
  //projectsStore.addNewProjectInList(projectData)
  //projectsStore.incrementNewProjectId() updating alreadin reinitialization
  toastStore.displayNewMessage({
    severity: 'success',
    summary: 'Project Created',
    detail: projectData.name + ' was created was successfully',
    life: 3000,
  })
  await loadProjectInfoJson()
}

export async function deleteProject(projectId: number) {
  const tempProjectData: projectDataType = projectsStore.getProjectDataById(projectId)!
  const deleteProject: projectDataType = {
    id: tempProjectData.id,
    name: tempProjectData.name,
    desc: tempProjectData.desc,
  }
  const result = await window.electron.deleteProjectWithId(deleteProject)
  console.log(result)
  toastStore.displayNewMessage({
    severity: 'warn',
    summary: 'Project Deleted',
    detail: deleteProject.name + ' was deleted was successfully',
    life: 3000,
  })
  await loadProjectInfoJson()
}

export async function loadNewProject(projectId: number) {
  projectsStore.setNewCurrentProject(projectId)
  console.log(projectsStore.currentProject)
  //after loaded
  currentProject = projectsStore.currentProject
  toastStore.displayNewMessage({
    severity: 'success',
    summary: 'Project Opened',
    detail: currentProject.name + ' was opened was successfully',
    life: 3000,
  })
  const currentProjectData: projectDataType = {
    id: currentProject.id,
    name: currentProject.name,
    desc: currentProject.desc,
  }
  await window.electron.setNewCurrentProject(currentProjectData) //cannot pass projectsStore.currentProject value as it is not Clonable so, that's why a copy is created
  initializeTestcases()
  loadNewTestcase(-99)
  testcaseStore.setNodesFlowData(null)
}

export function initializeProjectService() {
  loadProjectInfoJson()
  projectsStore = useProjectsStore()
  testcaseStore = useTestcasesStore()
  toastStore = useToastStore()
}

export default {
  initializeProjectService,
  createNewProject,
  loadNewProject,
}
