<script setup lang="ts">
import PanelMenu from 'primevue/panelmenu'
import ContextMenu from 'primevue/contextmenu'
import { ref, useTemplateRef, computed, watch } from 'vue'
import { useProjectsStore } from '@/pinia_stores/projectsStore'
import { useTestcasesStore } from '@/pinia_stores/testcasesStore'
import 'primeicons/primeicons.css'
import type { projectDataType, testcaseDataType } from '@/ts_types/puppet_test_types'
import TestcaseNewModal from '../modals/TestcaseNewModal.vue'
import { deleteNodeFromTestcase, deleteTestcase, loadNewTestcase, startTestInBackend } from '@/services/testcaseService'
import type { NodeType, flowNode } from '@/ts_types/nodeType'
import { useVueFlow, type ViewportTransform, type VueFlowStore } from '@vue-flow/core'
import { useFlowStore } from '@/pinia_stores/flowStore'
import { EMenuItem } from '../../../electron_main/allEnums'
import TestcaseDeleteModal from '../modals/TestcaseDeleteModal.vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToastStore } from '@/pinia_stores/toastStore'
import TestcaseRenameModal from '../modals/TestcaseRenameModal.vue'
import { useUtilsStore } from '@/pinia_stores/utilsStore'

export interface MenuItem {
  itemType: EMenuItem
  itemData: flowNode | testcaseDataType | null
}
const props = defineProps({
  addNodeFromLeftPanel: { type: Function, required: true },
  saveFromLeftPanel: { type: Function, required: true },
})

let vueFlowInstance: VueFlowStore | null = null
const { setViewport, fitView, onPaneReady } = useVueFlow()
const projectsStore = useProjectsStore()
const testcasesStore = useTestcasesStore()
const flowStore = useFlowStore()
const confirm = useConfirm()
const toastStore = useToastStore()
const utilsStore = useUtilsStore()

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
      icon: 'pi pi-expand',
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
      icon: 'pi pi-expand',
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
      icon: 'pi pi-expand',
    }
    if (nodeData.data.nodeType === 'dom-node') {
      returnList.push(tempObj)
    }
  })
  return returnList
})
const items = ref([
  {
    key: '0',
    label: 'Nodes',
    isRoot: true,
    icon: 'pi pi-ticket',
    items: nodesListItems,
  },
  {
    key: '1',
    label: 'Variables',
    isRoot: true,
    icon: 'pi pi-database',
    items: varNodesListItems,
  },
  {
    key: '2',
    label: 'DOM Elements',
    isRoot: true,
    icon: 'pi pi-file-word',
    items: domNodesListItems,
  },
  {
    key: '3',
    label: 'Test Cases',
    isRoot: true,
    icon: 'pi pi-code',
    items: testcasesListItems,
  },
])

const contextMenuItemModal = ref([
  {
    label: 'Open',
    command: (e: any) => {
      contextMenuValueChanged(e)
    },
  },
  {
    label: 'Rename',
    command: (e: any) => {
      contextMenuValueChanged(e)
    },
  },
  {
    label: 'Delete',
    command: (e: any) => {
      contextMenuValueChanged(e)
    },
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
        command: (e: any) => {
          addNodeItemChanged(e)
        },
        nodeType: 'driver-node',
      },
      {
        label: 'Variable Node',
        command: (e: any) => {
          addNodeItemChanged(e)
        },
        nodeType: 'var-node',
      },
      {
        label: 'DOM Node',
        command: (e: any) => {
          addNodeItemChanged(e)
        },
        nodeType: 'dom-node',
      },
      {
        label: 'Assert Node',
        command: (e: any) => {
          addNodeItemChanged(e)
        },
        nodeType: 'asr-node',
      },
    ],
  },
  { separator: true },
  {
    label: 'Expland All',
    command: (e: any) => {
      expandAll()
    },
  },
  {
    label: 'Collapse All',
    command: (e: any) => {
      collapseAll()
    },
  },
  { separator: true },
  {
    label: 'Run',
    command: (e: any) => {
      startTestInBackend()
    },
  },
  {
    label: 'Save',
    command: (e: any) => {
      toastStore.displayNewMessage({
        severity: 'success',
        summary: 'Saved',
        detail: 'Successfully',
        life: 3000,
      })
      props.saveFromLeftPanel({
        cmd: 'Save',
      })
    },
  },
  { separator: true },
  {
    label: 'Clear Terminal',
    command: (e: any) => {
      utilsStore.clearTerminal(Date.now())
    },
  },
  {
    label: 'Exit App',
    command: async (e: any) => {
      await window.electron.exitApp(null)
    },
  },
])
const contextMenuModal = ref()
const contextMenuRef = useTemplateRef('contextMenu-ref')
const testcaseNewModalRef = useTemplateRef('testcaseNewModal-ref')
const testcaseDeleteModalRef = useTemplateRef('testcaseDeleteModal-ref')
const testcaseRenameModalRef = useTemplateRef('testcaseRenameModal-ref')
const curSelectedItem = ref('null')
const expandedKeys = ref({
  '0': false,
  '1': false,
  '2': false,
  '3': false,
})
const curRightClickItem = ref<MenuItem>({ itemType: EMenuItem.Unknown, itemData: null })
const currentProjectName = ref('null')

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
watch(
  () => testcasesStore.currentTestcase,
  (newTc: testcaseDataType, oldTc: testcaseDataType) => {
    if (newTc.id !== -99) {
      selectItemWithLabel(newTc.name)
    }
  },
)
watch(
  () => projectsStore.currentProject,
  (newProject: projectDataType, oldProject: projectDataType) => {
    currentProjectName.value = newProject.name
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
}

function selectItemWithLabel(labelValue: string) {
  curSelectedItem.value = labelValue
}
// context menu functsion
const displayContextMenuPanel = (e: any) => {
  contextMenuModal.value = contextMenuPanelModal.value
  contextMenuRef.value?.show(e)
}
const displayContextMenuItem = (e: any) => {
  contextMenuModal.value = contextMenuItemModal.value
  contextMenuRef.value?.show(e)
}
function contextMenuValueChanged(e: any) {
  if (e.item.label === 'Open') {
    if (curRightClickItem.value.itemType === EMenuItem.Node) {
      vueFlowInstance?.fitView({ nodes: [curRightClickItem.value.itemData?.id as string] })
    }
  } else if (e.item.label === 'Rename') {
    if (curRightClickItem.value.itemType === EMenuItem.Testcase) {
      const testcaseData = curRightClickItem.value.itemData as testcaseDataType
      testcaseRenameModalRef.value?.toggleModalVisibility(testcaseData)
    } else if (curRightClickItem.value.itemType === EMenuItem.Node) {
      flowStore.setCurrentSelectedNodeId(curRightClickItem.value?.itemData?.id as string)
    }
  } else if (e.item.label === 'Delete') {
    if (curRightClickItem.value.itemType === EMenuItem.Node) {
      const nodeId: string = curRightClickItem.value.itemData!.id as string
      deleteNodeFromTestcase(nodeId)
    } else if (curRightClickItem.value.itemType === EMenuItem.Testcase) {
      const testcaseData = curRightClickItem.value.itemData as testcaseDataType
      //deleteTestcase(testcaseData)
      //testcaseDeleteModalRef.value?.toggleModalVisibility(null, testcaseData)
      confirmTestcaseDelete(testcaseData)
    }
  }
}

function addNodeItemChanged(e: any) {
  console.log(e)
  toastStore.displayNewMessage({
    severity: 'info',
    summary: 'Node Added',
    detail: 'Type: ' + e.item.nodeType,
    life: 3000,
  })
  const data = {
    posX: 500,
    posY: 500,
    node: e.item.nodeType,
  }
  props.addNodeFromLeftPanel(data)
}

const confirmTestcaseDelete = (selectedTestcase: testcaseDataType) => {
  confirm.require({
    message: 'Do you want to delete this testcase?',
    header: 'Confirm Action',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: () => {
      deleteTestcase(selectedTestcase)
      toastStore.displayNewMessage({
        severity: 'success',
        summary: 'Testcase Deleted',
        detail: selectedTestcase.name + ' was deleted was successfully',
        life: 3000,
      })
    },
  })
}

const checkAndDisplayContextMenuItem = (e: any, item: any) => {
  if (item.isRoot == true) {
  } else {
    if (item.nData) {
      curRightClickItem.value = {
        itemType: EMenuItem.Node,
        itemData: item.nData,
      }
    } else if (item.testcaseData) {
      curRightClickItem.value = {
        itemType: EMenuItem.Testcase,
        itemData: item.testcaseData,
      }
    }
    console.log(curRightClickItem.value)
    displayContextMenuItem(e)
  }
}

const expandAll = () => {
  const tempObj = {
    '0': true,
    '1': true,
    '2': true,
    '3': true,
  }
  expandedKeys.value = { ...tempObj }
}
const collapseAll = () => {
  const tempObj = {
    '0': false,
    '1': false,
    '2': false,
    '3': false,
  }
  expandedKeys.value = { ...tempObj }
}
</script>
<template>
  <TestcaseNewModal ref="testcaseNewModal-ref" />
  <TestcaseDeleteModal ref="testcaseDeleteModal-ref" />
  <TestcaseRenameModal ref="testcaseRenameModal-ref" />
  <ContextMenu ref="contextMenu-ref" :model="contextMenuModal" class="text-xs1 leading-xs1" :pt="contextMenu_pt" :dt="contextMenu_dt" />
  <div class="leftpanel text-xs1 leading-xs1" @contextmenu="displayContextMenuPanel">
    <div v-if="currentProjectName !== 'null'" class="border rounded-md mb-2 project-title-box">
      <h1 class="text-xs1 ms-2 my-1">{{ currentProjectName }}</h1>
    </div>
    <PanelMenu :model="items" v-model:expandedKeys="expandedKeys" class="" multiple :pt="panelMenu_pt" :dt="panelMenu_dt">
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
          <span v-show="hasSubmenu" :class="[{ 'pi pi-angle-down': active }, { 'pi pi-angle-right': !active }]"></span>
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
.project-title-box {
  border-color: var(--p-panelmenu-panel-border-color);
}
</style>
