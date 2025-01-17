<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/misc/HelloWorld.vue'
import MainMenuBar from './components/menus&bars/MenuBar.vue'
import MainToolBar from './components/menus&bars/ToolBar.vue'
import CanvasPanel from './components/panels/CanvasPanel.vue'
import RightClickMenu from './components/menus&bars/RightClickMenu.vue'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
import type { TreeNode } from 'primevue/treenode'
import Tree from 'primevue/tree'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import LeftPanel from './components/panels/LeftPanel.vue'
import LogTerminal from './components/panels/LogPanel.vue'
import { useToast } from 'primevue'
import Toast, { type ToastMessageOptions } from 'primevue/toast'
import { useToastStore } from './pinia_stores/toastStore'
import EmptyCanvasPanel from './components/panels/EmptyCanvasPanel.vue'
import { useTestcasesStore } from './pinia_stores/testcasesStore'

const toast = useToast()
const toastStore = useToastStore()
const testcasesStore = useTestcasesStore()

const contextMenuActive = ref(false)
const contextMenuPos = ref({
  top: '100px',
  left: '100px',
})
const contextMenuAbsPos = ref({
  top: 0,
  left: 0,
})
const rightClickMenuRef = useTemplateRef('contextMenuDiv-ref')
let nodes: TreeNode[] = [
  {
    key: '0',
    label: 'test1',
    children: [
      {
        key: '0-1',
        label: 'opt1',
        children: [
          {
            key: '0-1-1',
            label: 'aa1',
          },
        ],
      },
    ],
  },
  {
    key: '1',
    label: 'test2',
  },
]
const isToggleActive = ref(false)
const mainCanvas = useTemplateRef('mainCanvas-ref')
const isTestcaseOpen = computed(() => {
  if (testcasesStore.currentTestcase.id === -99) {
    return false
  } else {
    return true
  }
})

function rightClickMenuClicked(e: any) {
  /* if (contextMenuActive.value === false) {
    e.preventDefault()
    contextMenuPos.value.top = e.clientY + 'px'
    contextMenuPos.value.left = e.clientX + 'px'
    contextMenuAbsPos.value.top = e.clientY
    contextMenuAbsPos.value.left = e.clientX
    //console.log(contextMenuPos.value)
    contextMenuActive.value = true
  } else {
    contextMenuActive.value = false
  } */
  contextMenuAbsPos.value.top = e.clientY
  contextMenuAbsPos.value.left = e.clientX
  //console.log(e.clientX)
  //console.log(e.clientY)

  rightClickMenuRef.value?.callToggleContextMenu(e)
}
function checkContextMenu(e: any) {
  contextMenuActive.value = false
}
watch(
  () => toastStore.toastAddObject,
  (newObj, oldObj) => {
    toast.add(newObj)
  },
)
function callFromContextmenu(data: any) {
  if (mainCanvas.value) {
    data.posX = contextMenuAbsPos.value.left // can remove this to be based on exact mouse position
    data.posY = contextMenuAbsPos.value.top // this resets click pos to menu top left corner pos
    checkContextMenu(data)
    mainCanvas.value.calledFromParent(data)
  }
}
function afterCommandExecute(data: any) {
  mainCanvas.value?.handleCommandExecute(data)
}
function toggleDarkMode() {
  //isToggleActive.value = !isToggleActive.value
  document.documentElement.classList.toggle('app-dark')
}
</script>

<template>
  <div class="bg-yellow-300" :class="{ 'app-dark': isToggleActive }">
    <!-- <div
      class="absolute z-[1]"
      :style="contextMenuPos"
      :class="{ block: contextMenuActive, hidden: !contextMenuActive }"
    >
      <RightClickMenu :call-from-context-menu="callFromContextmenu" />
    </div> -->
    <Toast />
    <RightClickMenu ref="contextMenuDiv-ref" :call-from-context-menu="callFromContextmenu" :on-command-execute="afterCommandExecute" />
    <!-- <div
      class="w-screen h-6 bg-mbackground-700 border-b-2 border-mbackground-def text-white flex items-center ps-1 select-none"
    >
      <div class="h-3 w-3 ms-2 bg-mblue-400"></div>
      <p class="ps-2 text-sm">Nodxess</p>
    </div> -->
    <!-- <div
      class="w-screen h-6 bg-mbackground-900 text-sm flex ps-1 items-center border-b-2 border-mbackground-def select-none text-white rounded-md"
    >
      <MainMenuBar />
    </div> -->
    <MainMenuBar />
    <MainToolBar :call-toggle-in-parent="toggleDarkMode" />
    <!-- <div class="flex leftbar">
      <div class="w-64 bg-mbackground-900 rounded-r-lg">
        <Tree :value="nodes" class="w-full md:w-[30rem]"> </Tree>
        <ToggleSwitch @update:model-value="toggleValueChanged($event)" />
      </div>
      <div class="w-full h-full" @contextmenu="rightClickMenuClicked" @click="checkContextMenu">
        <CanvasPanel ref="mainCanvas-ref" />
      </div>
    </div> -->
    <Splitter class="leftbar">
      <SplitterPanel class="" :size="15" :minSize="10">
        <LeftPanel />
      </SplitterPanel>
      <SplitterPanel class="" :size="85">
        <Splitter layout="vertical">
          <SplitterPanel :size="75">
            <div v-if="isTestcaseOpen === true" class="w-full h-full" @contextmenu="rightClickMenuClicked" @click="checkContextMenu">
              <CanvasPanel ref="mainCanvas-ref" />
            </div>
            <EmptyCanvasPanel v-else />
          </SplitterPanel>
          <SplitterPanel :size="25">
            <LogTerminal />
          </SplitterPanel>
        </Splitter>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<style scoped>
.leftbar {
  @apply rounded-none;
  height: calc(100vh - (88px) + 26px);
}
</style>
