<script setup lang="ts">
import { VueFlow, useVueFlow, useNodesData } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { ref, watch, onMounted } from 'vue'
import DriverNode from '.././nodes/DriverNode.vue'
import VarNode from '.././nodes/VarNode.vue'
import DomNode from '.././nodes/DomNode.vue'
import PropertiesModal from '.././modals/PropertiesModal.vue'
import type { nodeData } from '@/ts_types/nodeType'
import { useTestcasesStore } from '@/pinia_stores/testcasesStore'
import { loadTestcaseData } from '@/services/testcaseService'
import type { testcaseDataType, testcaseFlowDataType } from '@/ts_types/puppet_test_types'
import { useFlowStore } from '@/pinia_stores/flowStore'
import type { FlowExportObject } from '@vue-flow/core'
import AssertNode from '../nodes/AssertNode.vue'

const {
  onConnect,
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
} = useVueFlow()
const testcasesStore = useTestcasesStore()
const flowStore = useFlowStore()

//#region Refs
const nodesData: nodeData[] = [
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
]
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
const curSelectedNodeId = ref('-1')
const idRef = ref(0)
const isPropertiesPanelVisible = ref(false)
//#endregion
let curNodeId = '0'

onPaneReady((evar) => {
  console.log('one pan ready is ready called')
  flowStore.setVueFlowInstance(evar.id)
})

onConnect((connection) => {
  console.log(connection)
  if (connection.sourceHandle === 'flow-next' && connection.targetHandle === 'flow-prev') {
    const newTargetData: Partial<nodeData> = {
      flow: {
        prevNodeId: connection.source,
      },
    }
    const newSourceData: Partial<nodeData> = {
      flow: {
        nextNodeId: connection.target,
      },
    }
    updateNodeData(connection.target, newTargetData)
    updateNodeData(connection.source, newSourceData)
  }
  addEdges(connection)
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
  let nodeInfo: { id: string; data: nodeData; position: object; type: string }

  if (data.node === 'driver-node') {
    nodeInfo = {
      id: idRef.value.toString(),
      data: {
        nodeName: 'Node ' + idRef.value.toString(),
        nodeType: 'driver-node',
        reqNodeName: false,
        label: 'type: ' + data.node,
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
      position: { x: data.posX, y: data.posY },
      type: data.node,
    }
    AddNodes(nodeInfo)
  } else if (data.node === 'var-node') {
    nodeInfo = {
      id: idRef.value.toString(),
      data: {
        nodeName: 'Node ' + idRef.value.toString(),
        nodeType: 'var-node',
        label: 'type: ' + data.node,
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
      position: { x: data.posX, y: data.posY },
      type: data.node,
    }
    AddNodes(nodeInfo)
  } else if (data.node === 'dom-node') {
    nodeInfo = {
      id: idRef.value.toString(),
      data: {
        nodeName: 'Node ' + idRef.value.toString(),
        nodeType: 'dom-node',
        label: 'type: ' + data.node,
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
      position: { x: data.posX, y: data.posY },
      type: data.node,
    }
    AddNodes(nodeInfo)
  } else if (data.node === 'asr-node') {
    nodeInfo = {
      id: idRef.value.toString(),
      data: {
        nodeName: 'Node ' + idRef.value.toString(),
        nodeType: 'asr-node',
        label: 'type: ' + data.node,
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
      position: { x: data.posX, y: data.posY },
      type: data.node,
    }
    AddNodes(nodeInfo)
  }
  idRef.value = idRef.value + 1
  curNodeId = (idRef.value - 1).toString()
}
const handleCommandExecute = (data: any) => {
  if (data.cmd === 'Save') {
    saveTestCaseData()
  } else if (data.cmd === 'Load') {
    loadTestCaseData()
  }
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
async function loadTestCaseData() {
  const testcaseData = testcasesStore.getCurrentTestcase
  const result = await window.electron.loadTestCase(testcaseData)
  testcasesStore.setNodesFlowData(result)
  const numberOfNodes = result.nodes.length
  idRef.value = numberOfNodes
  curNodeId = numberOfNodes.toString()
  fromObject(result)
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
}

defineExpose({
  calledFromParent,
  handleCommandExecute,
})
</script>
<template>
  <VueFlow :nodes="nodes" @pane-click="afterPaneClick">
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
    <PropertiesModal
      :class="{ propertiesPanel: !isPropertiesPanelVisible }"
      :cur-selected-node-id="curSelectedNodeId"
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
