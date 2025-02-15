<script setup lang="ts">
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
})
</script>

<template>
  <g>
    <path
      class="edge-normal"
      :stroke-width="2.5"
      :stroke-dasharray="8"
      :d="`M ${sourceX},${sourceY} C ${sourceX + (targetX - sourceX) / 3}, ${sourceY}, ${targetX - (targetX - sourceX) / 3}, ${targetY}, ${targetX}, ${targetY}`"
    >
      <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="15s" begin="0s" fill="freeze" repeatCount="indefinite" />
    </path>
    <circle class="edge-normal" :cx="targetX" :cy="targetY" :r="14" :stroke-width="1.5" />
  </g>
</template>
<style scoped>
.edge-normal {
  @apply stroke-slate-400 hover:stroke-slate-600 fill-none;
}
</style>
