<script setup lang="ts">
import { VueFlow, useVueFlow, useNodesData } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { ref, watch, onMounted } from 'vue'
import DriverNode from '.././nodes/DriverNode.vue'
import VarNode from '.././nodes/VarNode.vue'
import DomNode from '.././nodes/DomNode.vue'
import PropertiesModal from '.././modals/PropertiesModal.vue'
import type { flowNode, NodeType } from '@/ts_types/nodeType'
import { useTestcasesStore } from '@/pinia_stores/testcasesStore'
import { loadTestcaseData, getTestcaseFlowData } from '@/services/testcaseService'
import type { testcaseDataType, testcaseFlowDataType } from '@/ts_types/puppet_test_types'
import { useFlowStore } from '@/pinia_stores/flowStore'
import type { FlowExportObject } from '@vue-flow/core'
import AssertNode from '../nodes/AssertNode.vue'
import LogNode from '../nodes/LogNode.vue'
import { useUtilsStore } from '@/pinia_stores/utilsStore'
import type { RefSymbol } from '@vue/reactivity'

const {
  onConnect,
  onEdgesChange,
  addEdges,
  addNodes,
  onNodesInitialized,
  updateNode,
  screenToFlowCoordinate,
  toObject,
  fromObject,
  onNodeClick,
  updateNodeData,
  onPaneReady,
  removeNodes,
  fitView,
  findNode
} = useVueFlow()
const testcasesStore = useTestcasesStore()
const flowStore = useFlowStore()
const utilsStore = useUtilsStore()

//#region Refs
/* const nodesData: nodeData[] = [
  {
    nodeName: 'nodeName not set',
    nodeType: 'driver-node',
    reqNodeName: false,
    label: 'type: driver-node',
    pCmd: {
      value: 'cmd not set',
    },
    pValue: {
      isConnected: false,
      isRuntime: false,
      connnectedNodeId: '-1',
      value: 'value not set',
      edgeId: '-1',
    },
    flow: {
      prevNodeId: '-1',
      nextNodeId: '-1',
    },
  },
  {
    nodeName: 'nodeName not set',
    nodeType: 'var-node',
    label: 'type:  var-node',
    pValue: {
      isConnected: false,
      isRuntime: false,
      connnectedNodeId: '-1',
      value: 'value not set',
      edgeId: '-1',
    },
    flow: {
      prevNodeId: '-1',
      nextNodeId: '-1',
    },
  },
  {
    nodeName: 'nodeDomName not set',
    nodeType: 'dom-node',
    label: 'type:  dom-node',
    pValue: {
      isConnected: false,
      isRuntime: false,
      connnectedNodeId: '-1',
      value: 'value not set',
      edgeId: '-1',
    },
    flow: {
      prevNodeId: '-1',
      nextNodeId: '-1',
    },
  },
] */
/* const nodes = ref([
  {
    id: '1',
    position: { x: 140, y: 140 },
    data: nodesData[0],
    type: 'driver-node',
  },
  {
    id: '2',
    position: { x: 280, y: 280 },
    data: nodesData[1],
    type: 'var-node',
  },
  {
    id: '3',
    position: { x: 480, y: 480 },
    data: nodesData[2],
    type: 'dom-node',
  },
]) */
const nodes = ref([])
const edges = ref([])
const curSelectedNodeId = ref('-1')
const idRef = ref(0)
const isPropertiesPanelVisible = ref(false)
//#endregion
let curNodeId = '0'

onPaneReady((evar) => {
  flowStore.setVueFlowInstance(evar.id)
})

onConnect((connection) => {
  //console.log(connection)
  if (connection.sourceHandle === 'flow-next' && connection.targetHandle === 'flow-prev') {
    const newTargetData: Partial<NodeType> = {
      prevNodeId: connection.source,
    }
    const newSourceData: Partial<NodeType> = {
      nextNodeId: connection.target,
    }
    updateNodeData(connection.target, newTargetData)
    updateNodeData(connection.source, newSourceData)
  }
  addEdges(connection)
})
onEdgesChange((changes) => {
  if (changes.length > 0) {
    if (changes[0].type === 'remove') {
      if (changes[0].sourceHandle === 'flow-next') {
        const newSourceData: Partial<NodeType> = {
          nextNodeId: '-1',
        }
        updateNodeData(changes[0].source, newSourceData)
      }
      if (changes[0].targetHandle === 'flow-prev') {
        const newTargetData: Partial<NodeType> = {
          prevNodeId: '-1',
        }
        updateNodeData(changes[0].target, newTargetData)
      }
    }
  }
})

onNodesInitialized(() => {
  updateNode(curNodeId, (node) => ({
    position: {
      x: node.position.x - node.dimensions.width,
      y: node.position.y - node.dimensions.height,
    },
  }))
})

onMounted(() => {
  loadTestCaseData()
})

function AddNodes(data: any) {
  const newPosition = screenToFlowCoordinate({ x: data.position.x, y: data.position.y })
  data.position = newPosition
  addNodes(data)
}

const patternColorRef = ref('#f0ff00')

const calledFromParent = (data: any) => {
  let nodeInfo: { id: string; data: NodeType; position: object; type: string }
  const createNodedata: NodeType = {
    nodeName: 'Node Id',
    nodeType: 'type-node',
    displayName: 'type: ',
    nodeData: {
      cmd: {
        isRequired: false,
        value: 'cmd not set',
        isGetOnly: false,
      },
      para1: {
        value: 'value not set',
        isConnected: false,
        isRequired: false,
        connectedNodeId: '-1',
        edgeId: '-1',
      },
      para2: {
        value: 'value not set',
        isConnected: false,
        isRequired: false,
        connectedNodeId: '-1',
        edgeId: '-1',
      },
    },
    prevNodeId: '-1',
    nextNodeId: '-1',
  }
  if (data.node === 'driver-node') {
    createNodedata.nodeName = 'Node ' + idRef.value.toString()
    createNodedata.nodeType = 'driver-node'
    createNodedata.displayName = 'type: ' + data.node
    createNodedata.nodeData.cmd.isRequired = true
    nodeInfo = {
      id: idRef.value.toString(),
      data: createNodedata,
      position: { x: data.posX, y: data.posY },
      type: data.node,
    }
    AddNodes(nodeInfo)
  } else if (data.node === 'var-node') {
    createNodedata.nodeName = 'Node ' + idRef.value.toString()
    createNodedata.nodeType = 'var-node'
    createNodedata.displayName = 'type: ' + data.node
    createNodedata.nodeData.para1.isRequired = true
    nodeInfo = {
      id: idRef.value.toString(),
      data: createNodedata,
      position: { x: data.posX, y: data.posY },
      type: data.node,
    }
    AddNodes(nodeInfo)
  } else if (data.node === 'dom-node') {
    createNodedata.nodeName = 'Node ' + idRef.value.toString()
    createNodedata.nodeType = 'dom-node'
    createNodedata.displayName = 'type: ' + data.node
    createNodedata.nodeData.para1.isRequired = true
    nodeInfo = {
      id: idRef.value.toString(),
      data: createNodedata,
      position: { x: data.posX, y: data.posY },
      type: data.node,
    }
    AddNodes(nodeInfo)
  } else if (data.node === 'asr-node') {
    createNodedata.nodeName = 'Node ' + idRef.value.toString()
    createNodedata.nodeType = 'asr-node'
    createNodedata.displayName = 'type: ' + data.node
    createNodedata.nodeData.para1.isRequired = true
    nodeInfo = {
      id: idRef.value.toString(),
      data: createNodedata,
      position: { x: data.posX, y: data.posY },
      type: data.node,
    }
    AddNodes(nodeInfo)
  } else if (data.node === 'log-node') {
    createNodedata.nodeName = 'Node ' + idRef.value.toString()
    createNodedata.nodeType = 'log-node'
    createNodedata.displayName = 'type: ' + data.node
    createNodedata.nodeData.para1.isRequired = true
    nodeInfo = {
      id: idRef.value.toString(),
      data: createNodedata,
      position: { x: data.posX, y: data.posY },
      type: data.node,
    }
    AddNodes(nodeInfo)
  }
  idRef.value = idRef.value + 1
  curNodeId = (idRef.value - 1).toString()
  reloadNodesFlowData()
}
const handleCommandExecute = (data: any) => {
  if (data.cmd === 'Save') {
    saveTestCaseData()
  } else if (data.cmd === 'Load') {
    loadTestCaseData()
  } else if (data.cmd === 'updateFlowData') {
    reloadNodesFlowData()
  }
}

/**
 * when parameters value are changed, the data is not updated in the flow state data
 */
function reloadNodesFlowData() {
  // for leftpanel to be updated after adding a new node
  testcasesStore.setNodesFlowData(toObject())
}

async function saveTestCaseData() {
  const testcaseSaveData: testcaseFlowDataType = {
    testcaseData: testcasesStore.getCurrentTestcase,
    nodesData: toObject(),
  }
  //const result = await window.electron.saveTestCase(toObject())
  const result = await window.electron.saveTestCase(testcaseSaveData)
  console.log(result)
}
async function savePreviousTestCase(oldTestcaseData: testcaseDataType) {
  const oldTC_Data: testcaseDataType = {
    id: oldTestcaseData.id,
    name: oldTestcaseData.name,
    headless: oldTestcaseData.headless,
    waitTime: oldTestcaseData.waitTime,
  }
  const testcaseSaveData: testcaseFlowDataType = {
    testcaseData: oldTC_Data,
    nodesData: toObject(),
  }
  const result = await window.electron.saveTestCase(testcaseSaveData)
  console.log(result)
  console.log('previous testcase saved')
}

watch(
  () => testcasesStore.currentTestcase,
  (newTestcase, oldTestcase) => {
    console.log('cur tc cahnged')
    savePreviousTestCase(oldTestcase)
    loadTestCaseData()
  },
)
watch(
  () => testcasesStore.deleteNodeId,
  (newId, oldId) => {
    removeNodes(newId, true)
    reloadNodesFlowData()
  },
)
watch(
  () => flowStore.currentSelectedNodeId,
  (newId, oldId) => {
    console.log(`new selected id ${newId} ${newId}`)
    if (isPropertiesPanelVisible.value === false) {
      isPropertiesPanelVisible.value = true
    }
    curSelectedNodeId.value = newId
  },
)
watch(
  () => flowStore.updateCounter,
  (newVal, oldVal) => {
    console.log('nodes flow data updated')
    reloadNodesFlowData()
  },
)
watch(
  () => utilsStore.deleteNodeNotifier,
  (newVal, oldVal) => {
    if (curSelectedNodeId.value !== '-1') {
      removeNodes(curSelectedNodeId.value, true)
      reloadNodesFlowData()
    }
  },
)
watch(
  () => utilsStore.fitViewNotifier,
  (newVal, oldVal) => {
    fitView()
  },
)
watch(
  () => utilsStore.rightMoveNotifier,
  (newVal, oldVal) => {
    if (curSelectedNodeId.value !== '-1'){
      const node: flowNode = findNode(curSelectedNodeId.value)
      if (node.data.nextNodeId !== '-1'){
        fitView({ nodes: [node.data.nextNodeId] })
        curSelectedNodeId.value = node.data.nextNodeId
      }  
    }
  }
)
watch(
  () => utilsStore.leftMoveNotifier,
  (newVal, oldVal) => {
    if (curSelectedNodeId.value !== '-1'){
      const node: flowNode = findNode(curSelectedNodeId.value)
      if (node.data.prevNodeId !== '-1'){
        fitView({ nodes: [node.data.prevNodeId] })
        curSelectedNodeId.value = node.data.prevNodeId
      }  
    }
  }
)

async function loadTestCaseData() {
  nodes.value = []
  edges.value = []
  const testcaseData = testcasesStore.getCurrentTestcase
  //const result = await window.electron.loadTestCase(testcaseData)
  const result = await getTestcaseFlowData(testcaseData)
  testcasesStore.setNodesFlowData(result)
  const numberOfNodes = result.nodes.length
  let maxId = 0
  result.nodes.forEach((node: flowNode) => {
    if (Number(node.id) > maxId) {
      maxId = Number(node.id)
    }
  })
  maxId = maxId + 1
  idRef.value = maxId // result.nodes.length
  curNodeId = maxId.toString() // numberOfNodes.toString()
  fromObject(result)
  isPropertiesPanelVisible.value = false
}
onNodeClick((node) => {
  if (isPropertiesPanelVisible.value === false) {
    isPropertiesPanelVisible.value = true
  }
  curSelectedNodeId.value = node.node.id
})
function afterPaneClick() {
  if (isPropertiesPanelVisible.value === true) {
    isPropertiesPanelVisible.value = false
  }
  if (curSelectedNodeId.value !== '-1') {
    console.log('alues ressted')
    curSelectedNodeId.value = '-1'
  }
}

defineExpose({
  calledFromParent,
  handleCommandExecute,
})
</script>
<template>
  <VueFlow :nodes="nodes" :edges="edges" @pane-click="afterPaneClick">
    <Background :gap="16" :size="2" class="mainbackground" pattern-color="#585858" />
    <!-- style="background-color: #1d1d1d" -->
    <Controls />
    <template #node-driver-node="props">
      <DriverNode :id="props.id" :data="props.data" :selected="props.selected" />
    </template>
    <template #node-var-node="props">
      <VarNode :id="props.id" :data="props.data" :selected="props.selected" />
    </template>
    <template #node-dom-node="props">
      <DomNode :id="props.id" :data="props.data" :selected="props.selected" />
    </template>
    <template #node-asr-node="props">
      <AssertNode :id="props.id" :data="props.data" :selected="props.selected" />
    </template>
    <template #node-log-node="props">
      <LogNode :id="props.id" :data="props.data" :selected="props.selected" />
    </template>
    <PropertiesModal
      :class="{ propertiesPanel: !isPropertiesPanelVisible }"
      :cur-selected-node-id="curSelectedNodeId"
      :on-details-changed="handleCommandExecute"
    />
  </VueFlow>
</template>
<style scoped>
.mainbackground {
  @apply bg-surface-0 dark:bg-surface-900;
}
.propertiesPanel {
  @apply hidden;
}
</style>
