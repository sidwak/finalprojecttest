<script setup lang="ts">
import type { NodeType } from '@/ts_types/nodeType'
import Textarea from 'primevue/textarea'
import { Position, Handle } from '@vue-flow/core'
import { ref, onMounted, onUnmounted, shallowRef, watch } from 'vue'
import './nodeStyles.css'
import { EExeState } from '@/pinia_stores/runnerStore'

//#region Props
const props = defineProps<{
  id: string
  data: NodeType | any
  selected: boolean
}>()
//#endregion

function getExecutedStateClass() {
  switch (props.data.exeState) {
    case EExeState.Normal:
      return 'node-normal'
    case EExeState.Error:
      return 'node-error'
    case EExeState.Success:
      return 'node-success'
    case EExeState.Warn:
      return 'node-warn'
  }
}
</script>
<template>
  <div class="node-container" :class="[{ 'node-container-highlight': props.selected }, getExecutedStateClass()]">
    <div class="node-heading">Log Node</div>
    <div class="node-content">
      <Textarea v-model="props.data.nodeData.para1.value" rows="3" cols="20" class="text-xs py-[0.3rem] px-[0.4rem] w-full" />
      <div class="flex justify-between mb-1">
        <p class="">
          <Handle
            type="target"
            :position="Position.Left"
            id="flow-prev"
            style="position: relative; left: -12px; top: 15px; background-color: yellow; border-color: yellow"
          />
          Previous
        </p>
        <p class="">
          <Handle
            type="source"
            :position="Position.Right"
            id="flow-next"
            style="position: relative; right: -31px; top: 15px; background-color: limegreen; border-color: limegreen"
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
  @apply h-5 w-[163px] bg-mblue-def text-white rounded-t-sm ps-3 py-0.5;
}
.node-content {
  @apply h-fit w-[163px] bg-surface-200 dark:bg-surface-800
    shadow-surface-300 dark:shadow-surface-700 shadow-inner
    px-3 py-2 flex flex-col;
}
</style>
