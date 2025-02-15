<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { io } from 'socket.io-client'
import ScrollPanel from 'primevue/scrollpanel'
import { useUtilsStore } from '@/pinia_stores/utilsStore'
import { useRunnerStore } from '@/pinia_stores/runnerStore'

const socket = io('ws://localhost:3000')
const utilsStore = useUtilsStore()
const runnerStore = useRunnerStore()
const innerTest = ref('$&nbspNode Testing Studio<br/>')
const scrollContent = ref()
const bottomItem = ref()

socket.on('broadcast', (data) => {
  console.log(data.message)
  const msg: string = data.message
  let newMsg = ''
  if (msg.includes('Executed') || msg.includes('Passed')) {
    newMsg = `<p class="text-green-500">$&nbsp` + data.message + `</p>`
  } else if (msg.includes('Failed')) {
    console.log('no')
    newMsg = `<p class="text-red-500">$&nbsp` + data.message + `</p>`
  } else if (msg.includes('expected')) {
    newMsg = `<p class="text-orange-500">$&nbsp` + data.message + `</p>`
  } else if (msg.includes('Info')) {
    newMsg = `<p class="text-yellow-500">$&nbsp` + data.message + `</p>`
  } else if (msg.includes('error') || msg.includes('Error')) {
    newMsg = `<p class="text-red-500">$&nbsp` + data.message + `</p>`
  } else {
    newMsg = `<p>$&nbsp` + data.message + `</p>`
  }
  innerTest.value = innerTest.value + newMsg
  //innerTest.value = innerTest.value + '<br />$&nbsp' + data.message
  //bottomItem.value.scrollIntoView({ behaviour: 'smooth', block: 'end' })
  bottomItem.value.scrollIntoView(false)
})
socket.on('runnerLogger', (data) => {
  console.log(data.message)
  const msg: string = data.message
  let newMsg = ''
  if (msg.includes('Executed') || msg.includes('Passed')) {
    newMsg = `<p class="text-green-500">$&nbsp` + data.message + `</p>`
  } else if (msg.includes('Failed')) {
    newMsg = `<p class="text-red-500">$&nbsp` + data.message + `</p>`
  } else if (msg.includes('expected')) {
    newMsg = `<p class="text-orange-500">$&nbsp` + data.message + `</p>`
  } else if (msg.includes('Info')) {
    newMsg = `<p class="text-yellow-500">$&nbsp` + data.message + `</p>`
  } else if (msg.includes('error') || msg.includes('Error')) {
    newMsg = `<p class="text-red-500">$&nbsp` + data.message + `</p>`
  } else {
    newMsg = `<p>$&nbsp` + data.message + `</p>`
  }
  innerTest.value = innerTest.value + newMsg
  //innerTest.value = innerTest.value + '<br />$&nbsp' + data.message
  //bottomItem.value.scrollIntoView({ behaviour: 'smooth', block: 'end' })
  bottomItem.value.scrollIntoView(false)
})
watch(
  () => utilsStore.terminalClearNotifier,
  (newVal, oldVal) => {
    innerTest.value = '$&nbspNode Testing Studio<br/>'
  },
)
</script>
<template>
  <div class="p-1 flex flex-col h-full">
    <p class="mb-1 flex-none">Logs</p>
    <ScrollPanel :ref="scrollContent" class="log-panel">
      <p v-html="innerTest"></p>
      <span ref="bottomItem" style="height: 10px; width: 100%" class="blue"></span>
    </ScrollPanel>
  </div>
</template>
<style scoped>
.log-panel {
  @apply border bottom-1 rounded-md p-2 grow text-xs1 font-roboto_mono h-20;
  border-color: var(--p-panelmenu-panel-border-color);
}
.blue {
  scroll-margin: 20px; /* text height is 19px */
}
</style>
