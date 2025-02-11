<script setup lang="ts">
import { ref, defineProps, defineExpose, computed } from 'vue'
import Dialog from 'primevue/dialog'
import { InputText, Button } from 'primevue'
import type { testcaseDataType } from '@/ts_types/puppet_test_types'
import { useTestcasesStore } from '@/pinia_stores/testcasesStore'
import { updateTestcase } from '@/services/testcaseService'

const testcasesStore = useTestcasesStore()

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
//#endregion

const isVisible = ref(false)
const testcaseNameInputRef = ref('')
const testcaseData = ref<testcaseDataType | null>(null)

const toggleModalVisibility = (e: any) => {
  isVisible.value = !isVisible.value
  if (e !== null) {
    testcaseData.value = e
    testcaseNameInputRef.value = e.name
  }
}

function renameButtonClick() {
  if (testcaseData.value) {
    testcaseData.value.name = testcaseNameInputRef.value
    updateTestcase(testcaseData.value)
    toggleModalVisibility(null)
  }
}

defineExpose({
  toggleModalVisibility,
})
</script>
<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="isVisible" modal header="Rename Testcase" :style="{ width: '25rem' }" :pt="dialog_pt" :dt="dialog_dt">
      <span class="text-surface-500 dark:text-surface-400 block mb-4">Enter new testcase name</span>
      <div class="flex items-center gap-4 mb-4">
        <label for="username" class="font-semibold w-24">Name</label>
        <InputText v-model="testcaseNameInputRef" type="text" class="text-xs py-[0.3rem] px-[0.4rem] w-full" />
      </div>
      <div class="flex justify-end gap-2">
        <Button label="Cancel" severity="secondary" class="py-[0.3rem] px-[0.4rem]" @click="toggleModalVisibility" />
        <Button label="Update" class="py-[0.3rem] px-[0.4rem]" @click="renameButtonClick" />
      </div>
    </Dialog>
  </div>
</template>
<style scope></style>
