<script setup lang="ts">
import Menubar from 'primevue/menubar'
import ProjectNewModal from '../modals/ProjectNewModal.vue'
import { ref, computed, watch, useTemplateRef } from 'vue'
import { useProjectsStore } from '@/pinia_stores/projectsStore'
import type { projectDataType } from '@/ts_types/puppet_test_types'
import { useToastStore } from '@/pinia_stores/toastStore'
import { loadNewProject } from '@/services/projectService'
import ProjectSelectModal from '../modals/ProjectSelectModal.vue'

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
const projectNewModalRef = useTemplateRef('projectNewModal-ref')
const projectSelectModalRef = useTemplateRef('projectSelectModal-ref')
const items = ref([
  {
    label: 'File',
    items: [
      {
        label: 'Open',
        command: () => {
          //openProjectsInfoJson()
          openProjectSelectModal()
        }, // items: no need .value because this goes into a HTML template
      },
      {
        label: 'New',
        command: () => {
          openProjectCreateModal()
        },
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

function openProjectCreateModal() {
  /* const result = await window.electron.getProjectsInfoJson('hello')
  console.log(result)
  projectsStore.setProjectsInfoJsonData(result) */
  projectNewModalRef.value?.toggleModalVisibility(null)
}
function openProjectSelectModal() {
  projectSelectModalRef.value?.toggleModalVisibility(null)
}
function openProject(data: any) {
  console.log(data)
  loadNewProject(data.item.id)
}
</script>
<template>
  <ProjectNewModal ref="projectNewModal-ref" />
  <ProjectSelectModal ref="projectSelectModal-ref" />
  <div class="text-xs1 leading-xs1">
    <Menubar :model="items" :pt="menuBar_pt" :dt="menuBarDt" oncha>
      <template #submenuicon></template>
    </Menubar>
  </div>
</template>
<style scoped></style>
