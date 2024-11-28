<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/misc/HelloWorld.vue'
import NodesList from './components/NodesList.vue'
import MainMenuBar from './components/MainMenuBar.vue'
import MainToolBar from './components/MainToolBar.vue'
import MainCanvas from './components/MainCanvas.vue'
import RightClickMenu from './components/RightClickMenu.vue'
import { nextTick, onMounted, ref, useTemplateRef } from 'vue'

const contextMenuActive = ref(false)
const contextMenuPos = ref({
  top: '100px',
  left: '100px',
})
const contextMenuAbsPos = ref({
  top: 0,
  left: 0,
})

function rightClickMenuClicked(e: any) {
  if (contextMenuActive.value === false) {
    e.preventDefault()
    contextMenuPos.value.top = e.clientY + 'px'
    contextMenuPos.value.left = e.clientX + 'px'
    contextMenuAbsPos.value.top = e.clientY
    contextMenuAbsPos.value.left = e.clientX
    //console.log(contextMenuPos.value)
    contextMenuActive.value = true
  } else {
    contextMenuActive.value = false
  }
  console.log('right clicked pressed')
  //console.log(e.clientX)
  //console.log(e.clientY)
}
function checkContextMenu(e: any) {
  contextMenuActive.value = false
}

const mainCanvas = useTemplateRef('mainCanvas-ref')

function callFromContextmenu(data: any) {
  if (mainCanvas.value) {
    data.posX = contextMenuAbsPos.value.left // can remove this to be based on exact mouse position
    data.posY = contextMenuAbsPos.value.top // this resets click pos to menu top left corner pos
    checkContextMenu(data)
    mainCanvas.value.calledFromParent(data)
  }
}
</script>

<template>
  <div class="bg-mbackground-def">
    <div
      class="absolute z-[1]"
      :style="contextMenuPos"
      :class="{ block: contextMenuActive, hidden: !contextMenuActive }"
    >
      <RightClickMenu :call-from-context-menu="callFromContextmenu" />
    </div>
    <div
      class="w-screen h-6 bg-mbackground-700 border-b-2 border-mbackground-def text-white flex items-center ps-1 select-none"
    >
      <div class="h-3 w-3 ms-2 bg-mblue-400"></div>
      <p class="ps-2 text-sm">Nodxess</p>
    </div>
    <div
      class="w-screen h-6 bg-mbackground-900 text-sm flex ps-1 items-center border-b-2 border-mbackground-def select-none text-white rounded-md"
    >
      <MainMenuBar />
    </div>
    <MainToolBar />
    <div class="flex leftbar">
      <div class="w-64 bg-mbackground-900 rounded-r-lg">
        <NodesList />
        <NodesList />
      </div>
      <div class="w-full h-full" @contextmenu="rightClickMenuClicked" @click="checkContextMenu">
        <MainCanvas ref="mainCanvas-ref" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.leftbar {
  height: calc(100vh - (88px));
}
</style>
