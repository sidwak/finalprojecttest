<script setup lang="ts">
import { nextTick, onActivated, onMounted, onUpdated, ref, useTemplateRef } from 'vue'
const props = defineProps({
  callFromContextMenu: { type: Function, required: true },
})

function callFunction(e: any) {
  const data = {
    posX: e.clientX,
    posY: e.clientY,
    node: e,
  }
  props.callFromContextMenu(data)
}
</script>
<template>
  <div
    class="h-64 w-44 pt-1 bg-mbackground-900 shadow-inner shadow-mbackground-800 text-white font-roboto_mono font-light text-sm select-none"
  >
    <div
      class="h-fit w-full ps-4 py-1 hover:bg-mbackground-700"
      @click="callFunction('custom-test')"
    >
      Add Driver Node
    </div>
    <div class="h-fit w-full ps-4 py-1 hover:bg-mbackground-700" @click="callFunction('var-node')">
      Add Variable Node
    </div>
    <div class="h-fit w-full ps-4 py-1 hover:bg-mbackground-700">Add Assert Node</div>
    <div class="h-fit w-full ps-4 py-1 hover:bg-mbackground-700">Add Wait Node</div>
    <div class="h-fit w-full ps-4 py-1 hover:bg-mbackground-700">Add Note</div>
  </div>
</template>
<style scoped></style>
