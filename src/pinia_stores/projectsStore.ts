import { defineStore } from 'pinia'
import type { projectDataType } from '@/ts_types/puppet_test_types'

export const useProjectsStore = defineStore('projectsStore', {
  state: () => ({
    projectsList: <projectDataType[]>[],
    newProjectId: 0,
    currentProject: <projectDataType>{
      id: -1,
      name: 'No project',
      desc: 'Open a project or create',
    },
  }),
  actions: {
    setProjectsInfoJsonData(newData: any) {
      this.projectsList.length = 0
      newData.projects.forEach((project: projectDataType) => {
        // here projects is the array
        this.projectsList.push(project)
        this.newProjectId = project.id + 1
      })
    },
    addNewProjectInList(projectData: projectDataType) {
      this.projectsList.push(projectData)
      this.newProjectId = projectData.id + 1
    },
    /* incrementNewProjectId() {
      this.newProjectId += 1
    }, */
    setNewCurrentProject(projectId: number) {
      this.projectsList.forEach((project: projectDataType) => {
        if (project.id === projectId) {
          this.currentProject = project
        }
      })
    },
  },
})
