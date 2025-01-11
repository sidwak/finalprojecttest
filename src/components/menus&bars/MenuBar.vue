<script setup lang="ts">
import Menubar from 'primevue/menubar'
import ProjectNewModal from '../modals/ProjectNewModal.vue'
import { ref, computed, watch, useTemplateRef } from 'vue'
import { useProjectsStore } from '@/pinia_stores/projectsStore'
import type { projectDataType } from '@/ts_types/puppet_test_types'
import { useToastStore } from '@/pinia_stores/toastStore'
import { loadNewProject } from '@/services/projectService'

const projectsStore = useProjectsStore()
const toastStore = useToastStore()

const projectsListItems = computed(() => {
  const projectsDataJson: any[] = projectsStore.projectsList
  let returnList: any[] = []
  projectsDataJson.forEach((numProject: projectDataType) => {
    const tempObj = {
      label: numProject.name,
      id: numProject.id,
      command: (e: any) => openProject(e),
    }
    returnList.push(tempObj)
  })
  return returnList
})
const currentProjectName = computed(() => {
  const projectName: string = 'project: ' + projectsStore.currentProject.name
  return projectName
})
const projectNewModalRef = useTemplateRef('projectNewModal-ref')
const items = ref([
  {
    label: 'File',
    items: [
      {
        label: 'Open',
        command: () => {
          openProjectsInfoJson()
        },
        items: projectsListItems, // no need .value because this goes into a HTML template
      },
      {
        label: 'New',
      },
      {
        label: 'Close',
      },
    ],
  },
  {
    label: 'Edit',
  },
  {
    label: 'Project',
  },
  {
    label: 'Action',
  },
  {
    label: 'Debug',
  },
  {
    label: 'Window',
  },
  {
    label: currentProjectName,
  },
])
//#region Primevue
const menuBarDt = {
  baseItemPadding: '0.25rem 0.5rem',
  //submenuIconSize: '0rem',
  root: {
    padding: '0rem 0.75rem',
    gap: '0rem',
    borderRadius: '0px',
  },
  item: {
    padding: '0.25rem 0.5rem',
  },
}
const menuBar_pt = {
  root: {
    class: 'border-0',
  },
  submenuIcon: {
    id: 'hello',
    width: '0px',
    height: '0px',
    class: 'w-0 h-0',
  },
  submenu: {
    class: 'min-w-[8rem]',
  },
}
//#endregion

async function openProjectsInfoJson() {
  /* const result = await window.electron.getProjectsInfoJson('hello')
  console.log(result)
  projectsStore.setProjectsInfoJsonData(result) */
  projectNewModalRef.value?.toggleModalVisibility(null)
}
function openProject(data: any) {
  console.log(data)
  loadNewProject(data.item.id)
}
</script>
<template>
  <!-- <div class="hover:bg-mbackground-600 px-2"><p>File</p></div>
  <div class="hover:bg-mbackground-600 px-2"><p>Edit</p></div>
  <div class="hover:bg-mbackground-600 px-2"><p>Project</p></div>
  <div class="hover:bg-mbackground-600 px-2"><p>Action</p></div>
  <div class="hover:bg-mbackground-600 px-2"><p>Debug</p></div>
  <div class="hover:bg-mbackground-600 px-2"><p>Window</p></div> -->
  <ProjectNewModal ref="projectNewModal-ref" />
  <div class="text-xs1 leading-xs1">
    <Menubar :model="items" :pt="menuBar_pt" :dt="menuBarDt" oncha>
      <template #submenuicon></template>
    </Menubar>
  </div>
</template>
<style scoped></style>
