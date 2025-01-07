export let isInitialized: boolean = false
import { useProjectsInfoStore } from '@/pinia_stores/projectsInfoStore'
import type { projectDataType } from '@/ts_types/puppet_test_types'

let projectsInfoStore: any = null

async function loadProjectInfoJson() {
  projectsInfoStore = useProjectsInfoStore()
  const result = await window.electron.getProjectsInfoJson('hello')
  console.log(result)
  projectsInfoStore.setData(result)
}

export function createNewProject(projectData: projectDataType) {
  //electron
}

export function initializeData() {
  loadProjectInfoJson()
}

export default {
  initializeData,
  createNewProject,
}
