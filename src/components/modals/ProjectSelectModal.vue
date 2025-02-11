<script setup lang="ts">
import { InputText, Button } from 'primevue'
import { ref, defineProps, defineExpose, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Listbox from 'primevue/listbox'
import { useProjectsStore } from '@/pinia_stores/projectsStore'
import { deleteProject, loadNewProject } from '@/services/projectService'
import type { projectDataType } from '@/ts_types/puppet_test_types'
import { useConfirm } from 'primevue/useconfirm'
import { useToastStore } from '@/pinia_stores/toastStore'

const projectsStore = useProjectsStore()
const confirm = useConfirm()
const toastStore = useToastStore()

const props = defineProps(['toggleNewProjectModal'])

//#region Primevue
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
//#endregion

const isVisible = ref(false)
const currentSelectedProject = ref<Partial<projectDataType> | null>(null)
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
function deleteProjectConfirm(selectedProjectItem: any) {
  deleteProject(selectedProjectItem.id)
}
function deleteButtonClicked() {
  if (currentSelectedProject.value !== null) {
    if (currentSelectedProject.value.id !== projectsStore.currentProject.id) {
      deleteProjectConfirm(currentSelectedProject.value)
    } else {
      toastStore.displayNewMessage({
        severity: 'error',
        summary: 'Deletion Failed',
        detail: 'Cannot delete project when it is open',
        life: 3000,
      })
    }
  }
}

const toggleModalVisibility = (e: any) => {
  if (projectsStore.currentProject.id !== -1) {
    console.log(projectsStore.currentProject.id)
    const selectedProject = {
      id: projectsStore.currentProject.id,
      name: projectsStore.currentProject.name,
    }
    currentSelectedProject.value = selectedProject
  }
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
    accept: () => {
      deleteButtonClicked()
    },
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
    <div class="flex justify-between gap-2 mt-4">
      <div class="flex gap-2">
        <Button label="New" severity="success" class="py-[0.3rem] px-[0.4rem]" @click="props.toggleNewProjectModal" />
        <Button label="Delete" severity="danger" class="py-[0.3rem] px-[0.4rem]" @click="confirmDelete" />
        <!-- <Button label="Cancel" severity="secondary" class="py-[0.3rem] px-[0.4rem]" @click="toggleModalVisibility" /> -->
      </div>
      <div>
        <Button label="Open" severity="" class="py-[0.3rem] px-[0.4rem]" @click="openButtonClicked" />
      </div>
    </div>
  </Dialog>
</template>
<style scoped></style>
