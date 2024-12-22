<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { io } from 'socket.io-client'
import ScrollPanel from 'primevue/scrollpanel'

const socket = io('ws://localhost:3000')
const innerTest = ref('$&nbspNode Testing Studio')
const scrollContent = ref()
const bottomItem = ref()

socket.on('broadcast', (data) => {
  console.log(data.message)
  innerTest.value = innerTest.value + '<br />$&nbsp' + data.message
  //bottomItem.value.scrollIntoView({ behaviour: 'smooth', block: 'end' })
  bottomItem.value.scrollIntoView(false)
})
</script>
<template>
  <div class="p-1 flex flex-col h-full">
    <p class="mb-1 flex-none">Logs Terminal</p>
    <ScrollPanel
      :ref="scrollContent"
      class="border bottom-1 rounded-md p-2 grow font-thin text-sm h-20"
    >
      <p v-html="innerTest"></p>
      <span ref="bottomItem" style="height: 10px; width: 100%" class="blue"></span>
    </ScrollPanel>
  </div>
</template>
<style scoped>
.blue {
  scroll-margin: 20px; /* text height is 19px */
}
</style>
