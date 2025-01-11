export let isInitialized: boolean = false
import { useProjectsStore } from '@/pinia_stores/projectsStore'
import type { projectDataType } from '@/ts_types/puppet_test_types'
import { useToastStore } from '@/pinia_stores/toastStore'
import { initializeTestcases } from './testcaseService'

// :any = undefined
let projectsStore: ReturnType<typeof useProjectsStore>
let toastStore: ReturnType<typeof useToastStore>
export let currentProject: projectDataType | null = null

async function loadProjectInfoJson() {
  const result = await window.electron.getProjectsInfoJson('hello')
  console.log(result)
  projectsStore.setProjectsInfoJsonData(result)
}

export function createNewProject(projectData: projectDataType) {
  const result = window.electron.createNewProject(projectData)
  console.log(result)
  projectsStore.addNewProjectInList(projectData)
  //projectsStore.incrementNewProjectId() updating alreadin reinitialization
  toastStore.displayNewMessage({
    severity: 'success',
    summary: 'Project Created',
    detail: projectData.name + ' was created was successfully',
    life: 3000,
  })
}

export function loadNewProject(projectId: number) {
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
  window.electron.setNewCurrentProject(currentProjectData) //cannot pass projectsStore.currentProject value as it is not Clonable so, that's why a copy is created
  initializeTestcases()
}

export function initializeProjectService() {
  loadProjectInfoJson()
  projectsStore = useProjectsStore()
  toastStore = useToastStore()
}

export default {
  initializeProjectService,
  createNewProject,
  loadNewProject,
}
