import { defineStore } from 'pinia'
import type { projectDataType } from '@/ts_types/puppet_test_types'

export const useProjectsInfoStore = defineStore('projectsInfo', {
  state: () => ({
    projectsList: <projectDataType[]>[
      {
        name: 'None',
      },
    ],
    newProjectId: 0,
    currentProject: <projectDataType>{
      id: -1,
      name: 'No project',
      desc: 'Open a project or create',
    },
  }),
  actions: {
    setData(newData: any) {
      this.projectsList.length = 0
      newData.projects.forEach((project: projectDataType) => {
        this.projectsList.push(project)
        this.newProjectId = project.id + 1
      })
    },
    incrementNewProjectId() {
      this.newProjectId += 1
    },
    setNewCurrentProject(projectId: number) {
      this.projectsList.forEach((project: projectDataType) => {
        if (project.id === projectId) {
          this.currentProject = project
        }
      })
    },
  },
})
