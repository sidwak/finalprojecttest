<script setup lang="ts">
import { VueFlow, useVueFlow, useNodesData } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { ref } from 'vue'
import TestNode from './nodes/TestNode.vue'
import VarNode from './nodes/VarNode.vue'
import PropertiesMenu from './menu/PropertiesMenu.vue'

const nodes = ref([
  {
    id: '1',
    position: { x: 140, y: 140 },
    data: { label: 'Node 3', cmd: 'nocmd' },
    type: 'driver-node',
    isSelected: false,
  },
  {
    id: '2',
    position: { x: 280, y: 280 },
    data: { label: 'Node 4', varName: 'no_name', varVal: 'no_val' },
    type: 'var-node',
    isSelected: false,
  },
])
const curSelectedNodeId = ref('-1')
const idRef = ref(3)
let curNodeId = '3'

const {
  onConnect,
  addEdges,
  addNodes,
  onNodesInitialized,
  updateNode,
  screenToFlowCoordinate,
  toObject,
  onNodeClick,
} = useVueFlow()

onConnect((connection) => {
  console.log(connection)
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
function isAppDark() {
  if (document.documentElement.classList.contains('app-dark')) {
    patternColorRef.value = '#7a7a7a'
  } else {
    patternColorRef.value = '#f0ff00'
  }
}

const calledFromParent = (data: any) => {
  const nodeInfo = {
    id: idRef.value.toString(),
    data: { label: 'Node ' + idRef.value.toString() },
    position: { x: data.posX, y: data.posY },
    type: data.node,
  }
  AddNodes(nodeInfo)
  idRef.value = idRef.value + 1
  curNodeId = (idRef.value - 1).toString()
}
const handleCommandExecute = (data: any) => {
  console.log('This is in maincanvas.vue ' + data.cmd)
  if (data.cmd === 'Save') {
    console.log('Data reterived')
    console.log(toObject())
  }
}

onNodeClick((node) => {
  curSelectedNodeId.value = node.node.id
})

defineExpose({
  calledFromParent,
  handleCommandExecute,
})
</script>
<template>
  <VueFlow :nodes="nodes">
    <Background :gap="16" :size="2" class="mainbackground" pattern-color="#585858" />
    <!-- style="background-color: #1d1d1d" -->
    <Controls />
    <template #node-driver-node="props">
      <TestNode
        :id="props.id"
        :label="props.data.label"
        :cmd="props.data.cmd"
        :selected="props.selected"
      />
    </template>
    <template #node-var-node="props">
      <VarNode
        :id="props.id"
        :label="props.data.label"
        :data="props.data"
        :selected="props.selected"
      />
    </template>
    <PropertiesMenu :cur-selected-node-id="curSelectedNodeId" />
  </VueFlow>
</template>
<style scoped>
.mainbackground {
  @apply bg-surface-0 dark:bg-surface-900;
}
</style>
