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
    position: { x: 50, y: 50 },
    data: { label: 'Node 1' },
  },
  {
    id: '2',
    position: { x: 90, y: 90 },
    data: { label: 'Node 2' },
  },
  {
    id: '3',
    position: { x: 140, y: 140 },
    data: { label: 'Node 3' },
    type: 'custom-test',
  },
  {
    id: '4',
    position: { x: 180, y: 180 },
    data: { label: 'Node 4' },
    type: 'var-node',
  },
])
const idRef = ref(5)
let curNodeId = '5'

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

defineExpose({
  calledFromParent,
})
</script>
<template>
  <VueFlow :nodes="nodes">
    <Background :gap="16" :size="2" pattern-color="#3d3d3d" style="background-color: #1d1d1d" />
    <Controls />
    <template #node-custom-test="props">
      <TestNode v-bind:props />
    </template>
    <template #node-var-node="props">
      <VarNode v-bind:props />
    </template>
  </VueFlow>
</template>
<style scoped></style>
