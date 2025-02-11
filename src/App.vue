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
import ConfirmDialog from 'primevue/confirmdialog'
import TitleBar from './components/menus&bars/TitleBar.vue'

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
function addNodeCallFromLeftPanel(data: any) {
  if (mainCanvas.value) {
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
    <ConfirmDialog></ConfirmDialog>
    <RightClickMenu ref="contextMenuDiv-ref" :call-from-context-menu="callFromContextmenu" :on-command-execute="afterCommandExecute" />
    <!-- <MainMenuBar /> -->
    <TitleBar />
    <MainToolBar :call-toggle-in-parent="toggleDarkMode" />
    <Splitter class="leftbar">
      <SplitterPanel class="" :size="15" :minSize="10">
        <LeftPanel :add-node-from-left-panel="addNodeCallFromLeftPanel" :save-from-left-panel="afterCommandExecute" />
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
  height: calc(100vh - (96px) + 26px);
}
</style>
