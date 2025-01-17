<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { InputText, Button } from 'primevue'
import { ref, defineProps, defineExpose } from 'vue'
import type { testcaseDataType } from '@/ts_types/puppet_test_types'
import { useTestcasesStore } from '@/pinia_stores/testcasesStore'
import { createNewTestCase } from '@/services/testcaseService'

const props = defineProps(['isVisible'])
const testcasesStore = useTestcasesStore()

const dialog_pt = {}
const dialog_dt = {
  header: {
    padding: '0.75rem 0.75rem 0rem 0.75rem',
  },
  content: {
    padding: '0.75rem 0.75rem',
  },
}

const isVisible = ref(false)
const testcaseNameInputRef = ref('')

const toggleModalVisibility = (e: any) => {
  isVisible.value = !isVisible.value
}

function saveBtnClick() {
  toggleModalVisibility(null)
  const newTestcaseData: testcaseDataType = {
    id: testcasesStore.newTestcaseId,
    name: testcaseNameInputRef.value,
  }
  createNewTestCase(newTestcaseData)
}

defineExpose({
  toggleModalVisibility,
})
</script>
<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="isVisible" modal header="New Testcase" :style="{ width: '25rem' }" :pt="dialog_pt" :dt="dialog_dt">
      <span class="text-surface-500 dark:text-surface-400 block mb-4">Enter the details</span>
      <div class="flex items-center gap-4 mb-4">
        <label for="username" class="font-semibold w-24">Name</label>
        <InputText v-model="testcaseNameInputRef" type="text" class="text-xs py-[0.3rem] px-[0.4rem] w-full" />
      </div>
      <div class="flex justify-end gap-2">
        <Button label="Cancel" class="py-[0.3rem] px-[0.4rem]" @click="toggleModalVisibility" />
        <Button label="Create" class="py-[0.3rem] px-[0.4rem]" @click="saveBtnClick" />
      </div>
    </Dialog>
  </div>
</template>
<style></style>
