<script setup lang="ts">
import { Panel, useVueFlow } from '@vue-flow/core'
import { Divider, InputText } from 'primevue'
import { ref, computed } from 'vue'

const flowInst = useVueFlow()

const props = defineProps(['curSelectedNodeId'])
const curNodeData = computed(() => {
  return flowInst.findNode(props.curSelectedNodeId)
})
const nodeNameRef = ref(null)
const nodeValRef = ref(null)
const divider_dt = {
  colorScheme: {
    light: {
      root: {
        borderColor: '{zinc.600}',
      },
    },
    dark: {
      root: {
        borderColor: '{zinc.500}',
      },
    },
  },
}
const divider_pt = {
  root: {
    class: 'my-3',
  },
}
function setInitData() {
  //get values from nodes
}
function onNodeNameChange(newVal: any) {
  if (curNodeData.value) {
    curNodeData.value.data.varName = newVal
  }
}
function onNodeValueChange(newVal: any) {
  if (curNodeData.value) {
    curNodeData.value.data.varVal = newVal
  }
}
</script>
<template>
  <Panel position="top-right">
    <div class="propertiesMenu">
      <div class="propertiesMenu-heading">Properties</div>
      <Divider :pt="divider_pt" :dt="divider_dt" />
      <div class="propertiesMenu-content">
        <div class="flex gap-2 items-center justify-between">
          Node Type:
          <InputText disabled :placeholder="curNodeData?.type" size="small" />
        </div>
        <div class="flex gap-2 items-center justify-between">
          Node Name:
          <InputText
            type="text"
            v-model="nodeNameRef"
            class=""
            size="small"
            @value-change="onNodeNameChange"
          />
        </div>
        <div class="flex gap-2 items-center justify-between">
          Node Value:
          <InputText
            type="text"
            v-model="nodeValRef"
            class=""
            size="small"
            @value-change="onNodeValueChange"
          />
        </div>
      </div>
    </div>
  </Panel>
</template>
<style scoped>
.propertiesMenu {
  @apply h-fit w-fit p-3 bg-surface-200 dark:bg-surface-800 rounded-lg;
}
.propertiesMenu-heading {
  @apply font-semibold;
}
.propertiesMenu-content {
  @apply flex flex-col gap-1 text-muted-color;
}
</style>
