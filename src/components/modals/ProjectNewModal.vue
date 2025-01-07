<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { InputText, Button } from 'primevue'
import { ref, defineProps, defineExpose } from 'vue'
import type { projectDataType } from '@/ts_types/puppet_test_types'
import projectInfoService, { initializeData } from '@/services/projectInfoService'
import { useProjectsInfoStore } from '@/pinia_stores/projectsInfoStore'

const projectsInfoStore = useProjectsInfoStore()
const dialog_pt = {}
const dialog_dt = {
  header: {
    padding: '0.75rem 0.75rem 0rem 0.75rem',
  },
  content: {
    padding: '0.75rem 0.75rem',
  },
}

const props = defineProps(['isVisible'])
const isVisible = ref(false)
const projectNameInputRef = ref('')
const projectDescriptionInputRef = ref('')

const toggleModalVisibility = (e: any) => {
  isVisible.value = !isVisible.value
}
function saveBtnClick() {
  toggleModalVisibility(null)
  const newProjectData: projectDataType = {
    id: projectsInfoStore.newProjectId,
    name: projectNameInputRef.value,
    desc: projectDescriptionInputRef.value,
  }
  const result = window.electron.createNewProject(newProjectData)
  console.log(result)
  initializeData()
  projectsInfoStore.incrementNewProjectId()
}
defineExpose({
  toggleModalVisibility,
})
</script>
<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="isVisible"
      modal
      header="New Project"
      :style="{ width: '25rem' }"
      :pt="dialog_pt"
      :dt="dialog_dt"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-4">Enter the details</span>
      <div class="flex items-center gap-4 mb-4">
        <label for="username" class="font-semibold w-24">Name</label>
        <InputText
          v-model="projectNameInputRef"
          type="text"
          class="text-xs py-[0.3rem] px-[0.4rem] w-full"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="email" class="font-semibold w-24">Description</label>
        <InputText
          v-model="projectDescriptionInputRef"
          type="text"
          class="text-xs py-[0.3rem] px-[0.4rem] w-full"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button label="Cancel" class="py-[0.3rem] px-[0.4rem]" @click="toggleModalVisibility" />
        <Button label="Save" class="py-[0.3rem] px-[0.4rem]" @click="saveBtnClick" />
      </div>
    </Dialog>
  </div>
</template>
<style scoped></style>
