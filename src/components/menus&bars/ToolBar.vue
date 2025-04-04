<script setup lang="ts">
import 'primeicons/primeicons.css'
import ToggleSwitch from 'primevue/toggleswitch'
import { ref, useTemplateRef, watch } from 'vue'
import { useToast } from 'primevue'
import Toast from 'primevue/toast'
import { useTestcasesStore } from '@/pinia_stores/testcasesStore'
import { resetAllNodesExecutionState, saveTestcaseDataInBackend, startTestInBackend } from '@/services/testcaseService'
import { useFlowStore } from '@/pinia_stores/flowStore'
import { nextTick } from 'vue'
import ToggleButton from 'primevue/togglebutton'
import SettingsModal from '../modals/SettingsModal.vue'
import { useUtilsStore } from '@/pinia_stores/utilsStore'

const testcasesStore = useTestcasesStore()
const flowStore = useFlowStore()
const utilsStore = useUtilsStore()
const props = defineProps({
  callToggleInParent: { type: Function, required: true },
})
const checked = ref(false)
const isToggleActive = ref(false)
const settingsModalRef = useTemplateRef('settingsModal-ref')
const amberSwitch = {
  colorScheme: {
    light: {
      root: {
        checkedBackground: '{slate.500}',
        checkedHoverBackground: '{slate.600}',
      },
      handle: {
        checkedBackground: '{slate.50}',
        checkedHoverBackground: '{slate.100}',
      },
    },
    dark: {
      root: {
        checkedBackground: '{zinc.700}',
        checkedHoverBackground: '{zinc.600}',
      },
      handle: {
        checkedBackground: '{slate.900}',
        checkedHoverBackground: '{slate.800}',
      },
    },
  },
}
const toast = useToast()

function toggleValueChanged(isOn: any) {
  console.log('toggle value changed')
  console.log(isOn)
  props.callToggleInParent()
  isToggleActive.value = isOn
}

watch(
  () => utilsStore.settingsModalNotifier,
  (newVal, oldVal) => {
    settingsModalRef.value?.toggleModalVisibility(null)
  },
)

function settingsBuuttonClicked() {
  settingsModalRef.value?.toggleModalVisibility(null)
}

function runButtonClicked() {
  startTestInBackend()
}

function restartButtonClicked() {
  resetAllNodesExecutionState()
  utilsStore.clearTerminal(Date.now())
}
function moveRightButtonClicked() {
  utilsStore.moveToRightNode(Date.now())
}
function moveLeftButtonClicked() {
  utilsStore.moveToLeftNode(Date.now())
}
</script>
<template>
  <Toast />
  <SettingsModal ref="settingsModal-ref" />
  <div class="toolbar">
    <div
      class="toolbar-icon"
      v-tooltip.right="{ value: 'Run test', class: 'text-xs1 leading-xs1', showDelay: '300' }"
      @click="runButtonClicked"
    >
      <span class="pi pi-play toolbar-icon-span"></span>
    </div>
    <!-- <div class="toolbar-icon">
      <span class="pi pi-pause toolbar-icon-span"></span>
    </div> -->
    <div
      class="toolbar-icon"
      v-tooltip.bottom="{ value: 'Reset', class: 'text-xs1 leading-xs1', showDelay: '300' }"
      @click="restartButtonClicked"
    >
      <span class="pi pi-replay toolbar-icon-span"></span>
    </div>
    <div class="toolbar-divider"></div>
    <div
      class="toolbar-icon"
      v-tooltip.bottom="{ value: 'Transverse to previous node', class: 'text-xs1 leading-xs1', showDelay: '300' }"
      @click="moveLeftButtonClicked"
    >
      <span class="pi pi-angle-double-left toolbar-icon-span"></span>
    </div>
    <div
      class="toolbar-icon"
      v-tooltip.bottom="{ value: 'Transverse to next node', class: 'text-xs1 leading-xs1', showDelay: '300' }"
      @click="moveRightButtonClicked"
    >
      <span class="pi pi-angle-double-right toolbar-icon-span"></span>
    </div>
    <div class="toolbar-divider"></div>
    <div
      class="toolbar-icon"
      v-tooltip.bottom="{ value: 'Configure', class: 'text-xs1 leading-xs1', showDelay: '300' }"
      @click="settingsBuuttonClicked()"
    >
      <span class="pi pi-cog toolbar-icon-span"></span>
    </div>
    <ToggleSwitch
      v-model="checked"
      v-tooltip.bottom="{ value: 'Toggle theme', class: 'text-xs1 leading-xs1', showDelay: '300' }"
      @update:model-value="toggleValueChanged($event)"
      :dt="amberSwitch"
    >
      <template #handle="{ checked }">
        <i :class="['!text-xxs !leading-xxs pi dark:text-white', { 'pi-moon': checked, 'pi-sun': !checked }]" />
      </template>
    </ToggleSwitch>
  </div>
</template>
<style scoped>
.toolbar {
  @apply w-full h-9 flex items-center ps-3 gap-2 select-none bg-surface-0 dark:bg-surface-900
  text-surface-700 dark:text-surface-0 border-t;
  border-color: var(--p-panelmenu-panel-border-color);
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
.toolbar-divider {
  @apply h-6 w-[2px] bg-surface-300 dark:bg-surface-600;
}
</style>
