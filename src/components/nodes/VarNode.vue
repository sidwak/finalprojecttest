<script setup lang="ts">
import { Position, Handle } from '@vue-flow/core'
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'
import InputText from 'primevue/inputtext'

const props = defineProps(['id', 'label', 'data', 'selected'])
const inputRef = ref(null)
</script>
<template>
  <div class="node-container" :class="{ 'node-container-highlight': props.selected }">
    <div class="node-heading">Variable Node</div>
    <div class="node-content">
      <Handle
        type="target"
        :position="Position.Left"
        id="trg_main"
        style="top: 89px; background-color: mediumaquamarine; border-color: mediumaquamarine"
      />
      <div class="">
        <p class="mb-1 ms-[7px]">{{ props.data.varName }}</p>
        <InputText
          type="text"
          v-model="props.data.varVal"
          class="text-xs py-[0.3rem] px-[0.4rem] w-full"
        />
        <div class="flex justify-between mt-1 mb-1">
          <p class="">Set</p>
          <p class="">Get</p>
        </div>
      </div>
      <Handle
        type="source"
        :position="Position.Right"
        id="src_main"
        style="top: 89px; background-color: lime; border-color: lime"
      />
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
