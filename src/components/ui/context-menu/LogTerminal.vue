<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { io } from 'socket.io-client'
import ScrollPanel from 'primevue/scrollpanel'

const socket = io('ws://localhost:3000')
const innerTest = ref('$&nbspNode Testing Studio')
const scrollContent = ref()

socket.on('broadcast', (data) => {
  console.log(data.message)
  innerTest.value = innerTest.value + '<br />$&nbsp' + data.message
  scrollContent.value.$refs.content.scrollTop = scrollContent.value.$refs.content.scrollHeight
})
</script>
<template>
  <div class="p-1 flex flex-col h-full">
    <p class="mb-1 flex-none">Logs Terminal</p>
    <ScrollPanel :ref="scrollContent" class="border bottom-1 rounded-md p-2 grow font-thin text-sm">
      <p v-html="innerTest"></p>
    </ScrollPanel>
  </div>
</template>
<style scoped></style>
