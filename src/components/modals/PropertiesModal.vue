<script setup lang="ts">
import { Panel, useVueFlow } from '@vue-flow/core'
import { Divider, InputText } from 'primevue'
import { ref, computed, watch } from 'vue'
import type { NodeType } from '@/ts_types/nodeType'
import { ENode } from '../../../electron_main/allEnums'
enum nodeType {
  DriverNode = 'driver-node',
  VarNode = 'var-node',
  DomNode = 'dom-node',
}

const flowInst = useVueFlow()

const props = defineProps(['curSelectedNodeId', 'onDetailsChanged'])
/* const curNodeData = computed<NodeType>(() => {
  return flowInst.findNode(props.curSelectedNodeId)?.data
}) */
const curNodeData = computed<NodeType>({
  get() {
    if (flowInst.findNode(props.curSelectedNodeId)?.data) {
      return flowInst.findNode(props.curSelectedNodeId)?.data
    } else {
      return {
        nodeData: {
          para1: {
            isConnected: false,
          },
          para2: {
            isConnected: false,
          },
        },
      } as Partial<NodeType>
    }
  },
  set(newVal) {},
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
    if (curNodeData.value && newVal) {
      console.log(newVal)
      curNodeData.value.nodeName = newVal
    }
  },
})
const nodeValRef = computed({
  get() {
    if (curNodeData.value) {
      if (curNodeData.value.nodeData.para1.isConnected === true) {
        return 'from var: ' + flowInst.findNode(curNodeData.value.nodeData.para1.connectedNodeId)?.data.nodeName
      } else {
        return curNodeData.value.nodeData.para1.value
      }
    } else {
      return null
    }
  },
  set(newVal) {
    if (curNodeData.value && newVal) {
      curNodeData.value.nodeData.para1.value = newVal
    }
  },
})
const nodeVal2Ref = computed({
  get() {
    if (curNodeData.value) {
      if (curNodeData.value.nodeData.para2.isConnected === true) {
        return 'from var: ' + flowInst.findNode(curNodeData.value.nodeData.para2.connectedNodeId)?.data.nodeName
      } else {
        return curNodeData.value.nodeData.para2.value
      }
    } else {
      return null
    }
  },
  set(newVal) {
    if (curNodeData.value && newVal) {
      curNodeData.value.nodeData.para2.value = newVal
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
    props.onDetailsChanged({
      cmd: 'updateFlowData',
    })
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
      if (curNodeData.value.nodeData.para1.isRequired === true) {
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
function isNodeValue2InputRequired() {
  if (curNodeData.value) {
    if (curNodeData.value.nodeType === nodeType.DriverNode) {
      if (curNodeData.value.nodeData.para2.isRequired === true) {
        //if not set , undefined is falsy value
        return true
      } else {
        return false
      }
    } else {
      if (
        curNodeData.value.nodeType === ENode.varNode ||
        curNodeData.value.nodeType === ENode.domNode ||
        curNodeData.value.nodeType === ENode.logNode
      ) {
        return false
      } else {
        return true
      }
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
          <InputText disabled :placeholder="curNodeData.nodeType" size="small" />
        </div>
        <div class="flex gap-2 items-center justify-between" v-show="requireNodeName()">
          Node Name:
          <InputText type="text" v-model="nodeNameRef" class="" size="small" @value-change="onNodeNameChange" />
        </div>
        <div class="flex gap-2 items-center justify-between" v-show="isNodeValueInputRequired()">
          Node Value:
          <InputText
            type="text"
            v-model="nodeValRef"
            class=""
            size="small"
            :disabled="curNodeData.nodeData.para1.isConnected"
            @value-change="onNodeValueChange"
          />
        </div>
        <div class="flex gap-2 items-center justify-between" v-show="isNodeValue2InputRequired()">
          Node Value 2:
          <InputText
            type="text"
            v-model="nodeVal2Ref"
            class=""
            size="small"
            :disabled="curNodeData.nodeData.para2.isConnected"
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
