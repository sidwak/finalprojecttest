<script setup lang="ts">
import { Panel, useVueFlow } from '@vue-flow/core'
import { Divider, InputText } from 'primevue'
import { ref, computed, watch } from 'vue'
import type { nodeData } from '@/ts_types/nodeType'
enum nodeType {
  DriverNode = 'driver-node',
  VarNode = 'var-node',
  DomNode = 'dom-node',
}

const flowInst = useVueFlow()

const props = defineProps(['curSelectedNodeId'])
const curNodeData = computed<nodeData>(() => {
  return flowInst.findNode(props.curSelectedNodeId)?.data
})
const nodeNameRef = computed({
  get() {
    if (curNodeData.value) {
      return curNodeData.value.nodeName
    } else {
      return null
    }
  },
  set(newVal) {
    if (curNodeData.value) {
      curNodeData.value.nodeName = newVal
    }
  },
})
const nodeValRef = computed({
  get() {
    if (curNodeData.value) {
      if (curNodeData.value.pValue.isConnected === true) {
        return (
          'from var: ' + flowInst.findNode(curNodeData.value.pValue.connnectedNodeId)?.data.nodeName
        )
      } else {
        return curNodeData.value.pValue.value
      }
    } else {
      return null
    }
  },
  set(newVal) {
    if (curNodeData.value) {
      curNodeData.value.pValue.value = newVal
    }
  },
})
/* watch(
  () => props.curSelectedNodeId,
  (newId, oldId) => {
    //setInitData()
  },
) */
//#region Primevue
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
//#endregion

function onNodeNameChange(newVal: any) {
  if (curNodeData.value) {
    //curNodeData.value.data.varName = newVal //this creating a value if it's test node in dictionary
  }
}
function onNodeValueChange(newVal: any) {
  if (curNodeData.value) {
    //curNodeData.value.data.varVal = newVal
  }
}
function requireNodeName() {
  if (curNodeData.value) {
    if ('reqNodeName' in curNodeData.value) {
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}
function isNodeValueInputRequired() {
  if (curNodeData.value) {
    if (curNodeData.value.nodeType === nodeType.DriverNode) {
      if (curNodeData.value.pValue.isRequired === true) {
        //if not set , undefined is falsy value
        return true
      } else {
        return false
      }
    } else {
      return true
    }
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
          <InputText disabled :placeholder="curNodeData?.label" size="small" />
        </div>
        <div class="flex gap-2 items-center justify-between" v-show="requireNodeName()">
          Node Name:
          <InputText
            type="text"
            v-model="nodeNameRef"
            class=""
            size="small"
            @value-change="onNodeNameChange"
          />
        </div>
        <div class="flex gap-2 items-center justify-between" v-show="isNodeValueInputRequired()">
          Node Value:
          <InputText
            type="text"
            v-model="nodeValRef"
            class=""
            size="small"
            :disabled="curNodeData?.pValue.isConnected"
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
