<script setup lang="ts">
import { ref, computed, watch, useTemplateRef, onMounted } from 'vue'
import ProjectNewModal from '../modals/ProjectNewModal.vue'
import { useProjectsStore } from '@/pinia_stores/projectsStore'
import type { projectDataType } from '@/ts_types/puppet_test_types'
import { useToastStore } from '@/pinia_stores/toastStore'
import { loadNewProject } from '@/services/projectService'
import ProjectSelectModal from '../modals/ProjectSelectModal.vue'
import { Button } from 'primevue'

const projectsStore = useProjectsStore()

const currentProjectNameRef = ref('Open')
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
</script>
<template>
  <ProjectNewModal ref="projectNewModal-ref" />
  <ProjectSelectModal ref="projectSelectModal-ref" :toggle-new-project-modal="openProjectCreateModal" />
  <div class="titlebar">
    <div class="project-button">
      <button @click="openProjectSelectModal">Project: {{ currentProjectNameRef }}</button>
    </div>
  </div>
</template>
<style scoped>
.titlebar {
  @apply w-full h-8 flex items-center gap-2 select-none bg-surface-0 dark:bg-surface-900
  text-surface-700 dark:text-surface-0 border-t border-surface-300 dark:border-surface-600;
}
.project-button {
  @apply hover:bg-surface-100 dark:hover:bg-surface-800 px-4 rounded-md;
}
</style>
