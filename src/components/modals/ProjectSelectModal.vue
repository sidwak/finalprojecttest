<script setup lang="ts">
import { InputText, Button } from 'primevue'
import { ref, defineProps, defineExpose, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Listbox from 'primevue/listbox'
import { useProjectsStore } from '@/pinia_stores/projectsStore'
import { loadNewProject } from '@/services/projectService'
import type { projectDataType } from '@/ts_types/puppet_test_types'
import { useConfirm } from 'primevue/useconfirm'

const projectsStore = useProjectsStore()
const confirm = useConfirm()

const dialog_pt = {}
const dialog_dt = {
  header: {
    padding: '0.75rem 0.75rem 0rem 0.75rem',
  },
  content: {
    padding: '0.75rem 0.75rem',
  },
}
const orderList_pt = {
  controls: {
    style: 'display: none',
  },
}

const isVisible = ref(false)
const currentSelectedProject = ref(null)
const projectsListItems = computed(() => {
  const projectsDataJson: any[] = projectsStore.projectsList
  let returnList: any[] = []
  projectsDataJson.forEach((numProject: projectDataType) => {
    const tempObj = {
      name: numProject.name,
      id: numProject.id,
    }
    returnList.push(tempObj)
  })
  return returnList
})

function openProject(data: any) {
  console.log(data)
  loadNewProject(data.id)
  toggleModalVisibility(null)
}
function openButtonClicked() {
  if (currentSelectedProject.value !== null) {
    openProject(currentSelectedProject.value)
  }
}

const toggleModalVisibility = (e: any) => {
  isVisible.value = !isVisible.value
}

const confirmDelete = () => {
  confirm.require({
    message: 'Do you want to delete this project?',
    header: 'Confirm Action',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: () => {},
    reject: () => {
      toggleModalVisibility(null)
    },
  })
}

defineExpose({
  toggleModalVisibility,
})
</script>
<template>
  <Dialog v-model:visible="isVisible" modal header="Open Project" :style="{ width: '25rem' }" :pt="dialog_pt" :dt="dialog_dt">
    <span class="text-surface-500 dark:text-surface-400 block mb-4">Select the project to open</span>
    <Listbox v-model="currentSelectedProject" :options="projectsListItems" optionLabel="name" class="w-full" />
    <div class="flex justify-end gap-2 mt-4">
      <Button label="Cancel" severity="secondary" class="py-[0.3rem] px-[0.4rem]" @click="toggleModalVisibility" />
      <Button label="Delete" severity="danger" class="py-[0.3rem] px-[0.4rem]" @click="confirmDelete" />
      <Button label="Open" severity="" class="py-[0.3rem] px-[0.4rem]" @click="openButtonClicked" />
    </div>
  </Dialog>
</template>
<style scoped></style>
