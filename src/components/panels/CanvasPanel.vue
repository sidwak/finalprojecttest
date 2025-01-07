<script setup lang="ts">
import { VueFlow, useVueFlow, useNodesData } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { ref } from 'vue'
import DriverNode from '.././nodes/DriverNode.vue'
import VarNode from '.././nodes/VarNode.vue'
import DomNode from '.././nodes/DomNode.vue'
import PropertiesModal from '.././modals/PropertiesModal.vue'
import type { nodeData } from '@/ts_types/nodeType'

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
let curNodeId = '0'
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
} = useVueFlow()

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
  }
  idRef.value = idRef.value + 1
  curNodeId = (idRef.value - 1).toString()
}
const handleCommandExecute = (data: any) => {
  if (data.cmd === 'Save') {
    //console.log('Data reterived')
    //console.log(toObject())
    saveTestCaseData()
  } else if (data.cmd === 'Load') {
    loadTestCaseData()
  }
}

async function saveTestCaseData() {
  const result = await window.electron.saveTestCase(toObject())
  console.log(result)
}
async function loadTestCaseData() {
  const result = await window.electron.loadTestCase('hello')
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
