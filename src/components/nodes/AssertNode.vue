<script setup lang="ts">
import { Handle, Position, useVueFlow, useNodesData, useHandleConnections } from '@vue-flow/core'
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  shallowRef,
  computed,
  watch,
  onBeforeMount,
} from 'vue'
import { CascadeSelect, InputText } from 'primevue'
import type { nodeData } from '@/ts_types/nodeType'
enum fieldState {
  Hidden,
  Block,
  Grayed,
}

//#region Props
const props = defineProps<{
  id: string
  data: nodeData
  selected: boolean
}>()
//#endregion
//#region Refs
const selectedCmd = ref()
const varNameRef = computed(() => {
  if (selectedCmd.value) {
    return selectedCmd.value.cmd
  } else {
    return 'select a option'
  }
})
const varInputRef = ref()
const varStateRef = ref<fieldState>(fieldState.Block)
const commandsList = ref([
  {
    cmdgroup: 'Compare',
    group: [
      {
        cmd: 'equal',
      },
      {
        cmd: 'notEqual',
      },
      {
        cmd: 'greaterThan',
      },
      {
        cmd: 'lessThan',
      },
    ],
  },
  {
    cmdgroup: 'Value',
    group: [
      {
        cmd: 'true',
      },
      {
        cmd: 'false',
      },
      {
        cmd: 'null',
      },
      {
        cmd: 'empty',
      },
    ],
  },
  {
    cmdgroup: 'Length',
    group: [
      {
        cmd: 'above',
      },
      {
        cmd: 'below',
      },
    ],
  },
  {
    cmd: 'Type',
  },
])
//#endregion
//#region Primevue
const cascadeSelect_dt = {
  root: {
    paddingX: '0.4rem',
    paddingY: '0.3rem', // borderRadius: '0.15rem'
  },
  option: {
    padding: '0.3rem 0.3rem',
  },
}
const cascadeSelect_pt = {
  root: {
    class: '', //border-0
  },
  dropdown: {
    class: 'w-[1.5rem]',
  },
  dropdownIcon: {
    class: 'w-[10px] h-[10px]',
  },
}
//#endregion
//#region Vueflow

//#endregion

function onDropdownItemSelected(curCmd: any) {
  console.log(curCmd)
}
</script>
<template>
  <div class="node-container" :class="{ 'node-container-highlight': props.selected }">
    <div class="node-heading">Assert Node</div>
    <div class="node-content">
      <div>
        <p class="mb-1">Assert Condition</p>
        <div
          v-tooltip.top="{
            value: 'Assertion to make',
            class: 'text-xs1 leading-xs1',
            showDelay: '500',
          }"
        >
          <CascadeSelect
            v-model="selectedCmd"
            :options="commandsList"
            optionGroupLabel="cmdgroup"
            optionLabel="cmd"
            :optionGroupChildren="['group']"
            class="w-full"
            placeholder="Select a Command"
            appendTo="self"
            :pt="cascadeSelect_pt"
            :dt="cascadeSelect_dt"
            @update:modelValue="onDropdownItemSelected"
          >
          </CascadeSelect>
        </div>
      </div>
      <div class="" v-show="varStateRef === fieldState.Block || varStateRef === fieldState.Grayed">
        <p class="mt-2 mb-1">{{ varNameRef }}</p>
        <InputText
          type="text"
          v-model="varInputRef"
          class="text-xs py-[0.3rem] px-[0.4rem] w-full"
          :disabled="varStateRef === fieldState.Grayed"
        />
      </div>
      <div class="flex justify-between mb-1">
        <p class="">
          <Handle
            type="target"
            :position="Position.Left"
            id="var-set"
            style="
              position: relative;
              left: -12px;
              top: 15px;
              background-color: yellow;
              border-color: yellow;
            "
          />
          Previous
        </p>
        <p class="">
          <Handle
            type="source"
            :position="Position.Right"
            id="var-get"
            style="
              position: relative;
              right: -32px;
              top: 15px;
              background-color: limegreen;
              border-color: limegreen;
            "
          />
          Next
        </p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.node-container {
  @apply text-xs;
}
.node-container-highlight {
  @apply outline outline-1 outline-primary;
}
.node-heading {
  @apply h-5 w-[163px] bg-mblue-def text-white ps-3 py-0.5;
}
.node-content {
  @apply h-fit w-[163px] bg-surface-200 dark:bg-surface-800
    shadow-surface-300 dark:shadow-surface-700 shadow-inner
    px-3 py-2 flex flex-col;
}
</style>
