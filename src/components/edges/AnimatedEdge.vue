<script setup lang="ts">
import { EExeState } from '@/pinia_stores/runnerStore'

defineProps({
  sourceX: {
    type: Number,
    required: true,
  },
  sourceY: {
    type: Number,
    required: true,
  },
  targetX: {
    type: Number,
    required: true,
  },
  targetY: {
    type: Number,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <g>
    <path
      v-if="data.exeState === undefined || data.exeState === EExeState.Normal"
      class="edge-normal"
      :stroke-width="3"
      :d="`M ${sourceX},${sourceY} C ${sourceX + (targetX - sourceX) / 3}, ${sourceY}, ${targetX - (targetX - sourceX) / 3}, ${targetY}, ${targetX}, ${targetY}`"
    >
    </path>
    <path
      v-else-if="data.exeState === EExeState.Success"
      class="edge-success"
      :stroke-width="3"
      :stroke-dasharray="8"
      :d="`M ${sourceX},${sourceY} C ${sourceX + (targetX - sourceX) / 3}, ${sourceY}, ${targetX - (targetX - sourceX) / 3}, ${targetY}, ${targetX}, ${targetY}`"
    >
      <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="15s" begin="0s" fill="freeze" repeatCount="indefinite"
    /></path>
    <path
      v-else-if="data.exeState === EExeState.Error"
      class="edge-error"
      :stroke-width="3"
      :stroke-dasharray="8"
      :d="`M ${sourceX},${sourceY} C ${sourceX + (targetX - sourceX) / 3}, ${sourceY}, ${targetX - (targetX - sourceX) / 3}, ${targetY}, ${targetX}, ${targetY}`"
    >
      <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="15s" begin="0s" fill="freeze" repeatCount="indefinite"
    /></path>
    <!-- <circle :cx="targetX" :cy="targetY" fill="#fff" :r="4" stroke="#6F3381" :stroke-width="1.5" /> -->
  </g>
</template>
<style scoped>
.edge-normal {
  @apply stroke-slate-400 hover:stroke-slate-600 fill-none;
}
.edge-success {
  @apply stroke-green-500 hover:stroke-green-700 fill-none;
}
.edge-error {
  @apply stroke-red-500 hover:stroke-red-700 fill-none;
}
</style>
