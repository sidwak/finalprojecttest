<script setup lang="ts">
import PanelMenu from 'primevue/panelmenu'
import ContextMenu from 'primevue/contextmenu'
import { ref, useTemplateRef, computed, watch } from 'vue'
import { useProjectsStore } from '@/pinia_stores/projectsStore'
import { useTestcasesStore } from '@/pinia_stores/testcasesStore'
import 'primeicons/primeicons.css'
import type { testcaseDataType } from '@/ts_types/puppet_test_types'
import TestcaseNewModal from '../modals/TestcaseNewModal.vue'
import { loadNewTestcase } from '@/services/testcaseService'
import type { NodeType, flowNode } from '@/ts_types/nodeType'
import { useVueFlow, type ViewportTransform, type VueFlowStore } from '@vue-flow/core'
import { useFlowStore } from '@/pinia_stores/flowStore'

let vueFlowInstance: VueFlowStore | null = null
const { setViewport, fitView, onPaneReady } = useVueFlow()
const projectsStore = useProjectsStore()
const testcasesStore = useTestcasesStore()
const flowStore = useFlowStore()

const testcasesListItems = computed(() => {
  const testcasesDataJson: any[] = testcasesStore.testcasesList
  let returnList: any[] = []
  testcasesDataJson.forEach((numTestcase: testcaseDataType) => {
    const tempObj = {
      label: numTestcase.name,
      testcaseData: numTestcase,
      command: (e: any) => {
        openTestcase(e)
      },
    }
    returnList.push(tempObj)
  })
  return returnList
})
const nodesListItems = computed(() => {
  const nodesList: any[] = testcasesStore.nodesFlowData.nodes
  let returnList: any[] = []
  nodesList.forEach((nodeData: flowNode) => {
    const tempObj = {
      label: `${nodeData.data.nodeName} [id:${nodeData.id}]`,
      command: (e: any) => selectItem(e),
      nData: nodeData,
    }
    if (nodeData.data.nodeType === 'driver-node' || nodeData.data.nodeType === 'asr-node') {
      //tempObj.label = `${nodeData.data.nodeName} ${nodeData.id}`
      returnList.push(tempObj)
    }
  })
  return returnList
})
const varNodesListItems = computed(() => {
  const nodesList: any[] = testcasesStore.nodesFlowData.nodes
  let returnList: any[] = []
  nodesList.forEach((nodeData: flowNode) => {
    const tempObj = {
      label: `${nodeData.data.nodeName} [id:${nodeData.id}]`,
      command: (e: any) => selectItem(e),
      nData: nodeData,
    }
    if (nodeData.data.nodeType === 'var-node') {
      returnList.push(tempObj)
    }
  })
  return returnList
})
const domNodesListItems = computed(() => {
  const nodesList: any[] = testcasesStore.nodesFlowData.nodes
  let returnList: any[] = []
  nodesList.forEach((nodeData: flowNode) => {
    const tempObj = {
      label: `${nodeData.data.nodeName} [id:${nodeData.id}]`,
      command: (e: any) => selectItem(e),
      nData: nodeData,
    }
    if (nodeData.data.nodeType === 'dom-node') {
      returnList.push(tempObj)
    }
  })
  return returnList
})
const items = ref([
  {
    label: 'Nodes',
    isRoot: true,
    icon: 'pi pi-ticket',
    items: nodesListItems,
  },
  {
    label: 'Variables',
    isRoot: true,
    icon: 'pi pi-database',
    items: varNodesListItems,
  },
  {
    label: 'DOM Elements',
    isRoot: true,
    icon: 'pi pi-file-word',
    items: domNodesListItems,
  },
  {
    label: 'Test Cases',
    isRoot: true,
    icon: 'pi pi-code',
    items: testcasesListItems,
  },
  {
    label: 'Projects',
    isRoot: true,
    icon: 'pi pi-file',
    //items: projectsStore.projectsList,
  },
])

const contextMenuItemModal = ref([
  {
    label: 'Open',
  },
  {
    label: 'Rename',
  },
  {
    label: 'Delete',
  },
])
const contextMenuPanelModal = ref([
  {
    label: 'New Test Case',
    command: () => {
      testcaseNewModalRef.value?.toggleModalVisibility(null)
    },
  },
  {
    label: 'New Node',
    items: [
      {
        label: 'Driver Node',
      },
      {
        label: 'Variable Node',
      },
      {
        label: 'DOM Node',
      },
      {
        label: 'Assert Node',
      },
      {
        label: 'Math Node',
      },
    ],
  },
  { separator: true },
  {
    label: 'Collapse All',
  },
  { separator: true },
  {
    label: 'Save',
  },
  { separator: true },
  {
    label: 'Open Project',
  },
  {
    label: 'Close Project',
  },
])
const contextMenuModal = ref()
const contextMenuRef = useTemplateRef('contextMenu-ref')
const testcaseNewModalRef = useTemplateRef('testcaseNewModal-ref')
const curSelectedItem = ref('null')

//#region Primevue
const panelMenu_dt = {
  itemPadding: '0.3rem 0.6rem',
}
const panelMenu_pt = {
  submenuIcon: {
    width: '13px',
    height: '13px',
    class: 'w-[13px] h-[13px]',
  },
}
const contextMenu_dt = {
  itemPadding: '0.3rem 0.6rem',
}
const contextMenu_pt = {
  root: {
    class: 'min-w-[9rem]',
  },
  itemLabel: 'leading-[16px]',
}
//#endregion

function openTestcase(e: any) {
  const testcaseData: testcaseDataType = e.item.testcaseData
  loadNewTestcase(testcaseData.id)
  selectItemWithLabel(e.item.label)
}

watch(
  () => flowStore.instanceId,
  (newId, oldId) => {
    vueFlowInstance = useVueFlow(newId)
  },
)

function selectItem(e: any) {
  console.log(e)
  curSelectedItem.value = e.item.label
  /* const trns: ViewportTransform = {
    x: e.item.nData.position.x,
    y: e.item.nData.position.y,
    zoom: 1,
  } */
  //vueFlowInstance?.setViewport(trns)
  vueFlowInstance?.fitView({ nodes: [e.item.nData.id] })
  console.log(e)
}
function selectItemWithLabel(labelValue: string) {
  curSelectedItem.value = labelValue
}
const displayContextMenuPanel = (e: any) => {
  console.log(e)
  contextMenuModal.value = contextMenuPanelModal.value
  contextMenuRef.value?.show(e)
}
const displayContextMenuItem = (e: any) => {
  contextMenuModal.value = contextMenuItemModal.value
  contextMenuRef.value?.show(e)
}
const checkAndDisplayContextMenuItem = (e: any, item: any) => {
  if (item.isRoot == true) {
  } else {
    displayContextMenuItem(e)
  }
}
</script>
<template>
  <TestcaseNewModal ref="testcaseNewModal-ref" />
  <ContextMenu
    ref="contextMenu-ref"
    :model="contextMenuModal"
    class="text-xs1 leading-xs1"
    :pt="contextMenu_pt"
    :dt="contextMenu_dt"
  />
  <div class="leftpanel text-xs1 leading-xs1" @contextmenu="displayContextMenuPanel">
    <PanelMenu :model="items" class="" multiple :pt="panelMenu_pt" :dt="panelMenu_dt">
      <template #item="{ item, active, hasSubmenu }">
        <span
          class="flex items-center px-2 py-2 cursor-pointer group gap-2 rounded-md"
          :class="{ 'bg-highlight-emphasis': curSelectedItem === item.label }"
          @contextmenu="
            (e: any) => {
              checkAndDisplayContextMenuItem(e, item)
            }
          "
        >
          <span
            v-show="hasSubmenu"
            :class="[{ 'pi pi-angle-down': active }, { 'pi pi-angle-right': !active }]"
          ></span>
          <span :class="[item.icon, 'group-hover:text-inherit']"></span>
          <span :class="['ml-2', { 'font-semibold': item.items }]">{{ item.label }}</span>
        </span>
      </template>
    </PanelMenu>
    <!-- w-full -->
  </div>
</template>
<style scoped>
.leftpanel {
  @apply h-full w-full p-1;
}
</style>
