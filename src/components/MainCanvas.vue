<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { ref } from 'vue'
import TestNode from './nodes/TestNode.vue'
import VarNode from './nodes/VarNode.vue'

const nodes = ref([
  {
    id: '1',
    position: { x: 140, y: 140 },
    data: { label: 'Node 3' },
    type: 'driver-node',
  },
  {
    id: '2',
    position: { x: 280, y: 280 },
    data: { label: 'Node 4' },
    type: 'var-node',
  },
])
const idRef = ref(3)
let curNodeId = '3'

const { onConnect, addEdges, addNodes, onNodesInitialized, updateNode, screenToFlowCoordinate } =
  useVueFlow()

onConnect((connection) => {
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

const patternColorRef = ref('#f0ff00')
function isAppDark() {
  if (document.documentElement.classList.contains('app-dark')) {
    patternColorRef.value = '#7a7a7a'
  } else {
    patternColorRef.value = '#f0ff00'
  }
}

defineExpose({
  calledFromParent,
})
</script>
<template>
  <VueFlow :nodes="nodes">
    <Background :gap="16" :size="2" class="mainbackground" pattern-color="#585858" />
    <!-- style="background-color: #1d1d1d" -->
    <Controls />
    <template #node-driver-node="props">
      <TestNode v-bind:props />
    </template>
    <template #node-var-node="props">
      <VarNode v-bind:props />
    </template>
  </VueFlow>
</template>
<style scoped>
.mainbackground {
  @apply bg-surface-0 dark:bg-surface-900;
}
</style>
