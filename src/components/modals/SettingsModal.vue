<script setup lang="ts">
import { ref, defineProps, defineExpose, computed, watch, onMounted, onUpdated } from 'vue'
import Dialog from 'primevue/dialog'
import { InputText, Button } from 'primevue'
import type { testcaseDataType } from '@/ts_types/puppet_test_types'
import { useTestcasesStore } from '@/pinia_stores/testcasesStore'
import { updateTestcase } from '@/services/testcaseService'
import IconField from 'primevue/iconfield'
import InputNumber from 'primevue/inputnumber'
import InputIcon from 'primevue/inputicon'
import ToggleButton from 'primevue/togglebutton'
import 'primeicons/primeicons.css'
import ToggleSwitch from 'primevue/toggleswitch'

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
const waitTimeInputRef = ref('')
const headlessChecked = ref(false)
const testcaseData = ref<testcaseDataType | null>(null)

const toggleModalVisibility = (e: any) => {
  isVisible.value = !isVisible.value
  if (e !== null) {
    //
  }
}

onUpdated(() => {
  headlessChecked.value = testcasesStore.currentTestcase.headless
  waitTimeInputRef.value = testcasesStore.currentTestcase.waitTime.toString()
})
function updateButtonClicked() {
  updateTestcase(testcasesStore.getCurrentTestcase)
  toggleModalVisibility(null)
}

function onWaitTimeInputChanged(e: any) {
  testcasesStore.setTestcaseWaitTime(Number.parseInt(e))
}

function toggleValueChanged(isOn: any) {
  testcasesStore.setTestcaseHeadlessMode(isOn)
}

defineExpose({
  toggleModalVisibility,
})
</script>
<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="isVisible" modal header="Settings" :style="{ width: '16rem' }" :pt="dialog_pt" :dt="dialog_dt">
      <span class="text-surface-500 dark:text-surface-400 block mb-4">Testcase Configurations</span>
      <div class="flex items-center gap-4 mb-4">
        <div class="font-normal">WaitTime</div>
        <InputText
          v-model="waitTimeInputRef"
          type="text"
          class="text-xs py-[0.3rem] px-[0.4rem] w-full"
          @value-change="(e) => onWaitTimeInputChanged(e)"
        />
      </div>
      <div class="flex gap-4 mb-4">
        <div class="font-normal">Headless</div>
        <ToggleSwitch v-model="headlessChecked" @update:model-value="toggleValueChanged($event)" />
      </div>
      <div class="flex justify-end gap-2">
        <Button label="Done" class="py-[0.3rem] px-[0.4rem]" @click="updateButtonClicked" />
      </div>
    </Dialog>
  </div>
</template>
<style scope></style>
