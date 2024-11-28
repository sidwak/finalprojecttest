<script setup lang="ts">
import { Position, Handle } from '@vue-flow/core'
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'

const props = defineProps({
  label: String,
})
</script>
<template>
  <div class="fnt1 text-white font-roboto_mono font-light">
    <div class="h-4 w-28 bg-mblue-def rounded-t-sm ps-3">Variable Node</div>
    <div
      class="h-fit w-28 bg-mbackground-900 text-white shadow-mbackground-800 shadow-inner px-3 py-1 flex flex-col"
    >
      <Handle
        type="target"
        :position="Position.Left"
        id="trg_main"
        style="top: 57px; background-color: mediumaquamarine; border-color: mediumaquamarine"
      />
      <div class="">
        <input type="text" class="bg-mbackground-500 rounded-sm mt-2 px-1 w-full fnt1" />
        <div class="flex justify-between mt-1 mb-1">
          <p class="">Set</p>
          <p class="">Get</p>
        </div>
      </div>
      <Handle
        type="source"
        :position="Position.Right"
        id="src_main"
        style="top: 57px; background-color: lime; border-color: lime"
      />
    </div>
  </div>
</template>
<style scoped></style>
