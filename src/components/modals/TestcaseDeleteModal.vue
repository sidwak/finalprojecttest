<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { InputText, Button } from 'primevue'
import { ref, defineProps, defineExpose } from 'vue'
import type { testcaseDataType } from '@/ts_types/puppet_test_types'
import { useTestcasesStore } from '@/pinia_stores/testcasesStore'
import { createNewTestCase, deleteTestcase } from '@/services/testcaseService'

const props = defineProps(['isVisible'])
//#region Props
const isVisible = ref(false)
const selectedTestcase = ref<testcaseDataType | null>(null)
//#endregion
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

const toggleModalVisibility = (e: any, testcaseData?: testcaseDataType) => {
  isVisible.value = !isVisible.value
  if (testcaseData) {
    selectedTestcase.value = testcaseData
  }
}

function deleteBtnClick() {
  toggleModalVisibility(null)
  confirmDeleteTestcase()
}

function confirmDeleteTestcase() {
  deleteTestcase(selectedTestcase.value as testcaseDataType)
}

defineExpose({
  toggleModalVisibility,
})
//
</script>
<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="isVisible" modal header="Delete Testcase?" :pt="dialog_pt" :dt="dialog_dt">
      <span class="text-surface-500 dark:text-surface-400 block mb-4">Confirm to delete the testcase</span>
      <div class="flex justify-end gap-2">
        <Button label="Cancel" severity="secondary" class="py-[0.3rem] px-[0.4rem]" @click="toggleModalVisibility" />
        <Button label="Delete" severity="danger" class="py-[0.3rem] px-[0.4rem]" @click="deleteBtnClick" />
      </div>
    </Dialog>
  </div>
</template>
<style scoped></style>
