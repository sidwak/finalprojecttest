<script setup lang="ts">
import { ref, computed, watch, useTemplateRef, onMounted } from 'vue'
import ProjectNewModal from '../modals/ProjectNewModal.vue'
import { useProjectsStore } from '@/pinia_stores/projectsStore'
import type { projectDataType } from '@/ts_types/puppet_test_types'
import { useToastStore } from '@/pinia_stores/toastStore'
import { loadNewProject } from '@/services/projectService'
import ProjectSelectModal from '../modals/ProjectSelectModal.vue'
import { Button } from 'primevue'
import 'primeicons/primeicons.css'

const projectsStore = useProjectsStore()

const currentProjectNameRef = ref('Open')
const isMaximized = ref(false)
const projectNewModalRef = useTemplateRef('projectNewModal-ref')
const projectSelectModalRef = useTemplateRef('projectSelectModal-ref')

onMounted(() => {
  openProjectSelectModal()
})
watch(
  () => projectsStore.currentProject,
  (newProject: projectDataType, oldProject) => {
    currentProjectNameRef.value = newProject.name
  },
)

function openProjectCreateModal() {
  openProjectSelectModal()
  projectNewModalRef.value?.toggleModalVisibility(null)
}
function openProjectSelectModal() {
  projectSelectModalRef.value?.toggleModalVisibility(null)
}
function openProject(data: any) {
  console.log(data)
  loadNewProject(data.item.id)
}

async function exitButtonClicked() {
  await window.electron.exitApp(null)
}
async function minimizeButtonClicked() {
  await window.electron.minimizeApp(null)
}
async function maximizeButtonClicked() {
  await window.electron.maximizeApp(null)
  isMaximized.value = !isMaximized.value
}
</script>
<template>
  <ProjectNewModal ref="projectNewModal-ref" />
  <ProjectSelectModal ref="projectSelectModal-ref" :toggle-new-project-modal="openProjectCreateModal" />
  <div class="titlebar">
    <div class="project-button">
      <button @click="openProjectSelectModal">Project: {{ currentProjectNameRef }}</button>
    </div>
    <div class="grow h-full barDraggable"></div>
    <div class="windowButtons">
      <div class="toolbar-icon" @click="minimizeButtonClicked">
        <span class="pi pi-minus toolbar-icon-span"></span>
      </div>
      <div v-if="!isMaximized" class="toolbar-icon" @click="maximizeButtonClicked">
        <span class="pi pi-window-maximize toolbar-icon-span"></span>
      </div>
      <div v-else class="toolbar-icon" @click="maximizeButtonClicked">
        <span class="pi pi-window-minimize toolbar-icon-span"></span>
      </div>
      <div class="toolbar-icon" @click="exitButtonClicked">
        <span class="pi pi-times toolbar-icon-span"></span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.titlebar {
  @apply w-full h-8 flex items-center gap-2 select-none bg-surface-0 dark:bg-surface-900
  text-surface-700 dark:text-surface-0 border-t;
  border-color: var(--p-panelmenu-panel-border-color);
}
.project-button {
  @apply hover:bg-surface-100 dark:hover:bg-surface-800 px-4 rounded-md;
}
.windowButtons {
  @apply flex gap-1 me-2;
}
.barDraggable {
  app-region: drag;
}
.toolbar-icon {
  @apply h-6 w-6 text-center text-surface-700 dark:text-surface-0;
}
.toolbar-icon:hover {
  @apply text-surface-300 dark:text-surface-500;
}
.toolbar-icon-span {
  @apply text-sm;
}
</style>
