<script setup lang="ts">
import { Handle, Position, useVueFlow, useNodesData, useHandleConnections } from '@vue-flow/core'
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  shallowRef,
  computed,
  watch,
  onBeforeMount,
} from 'vue'
import { CascadeSelect, InputText } from 'primevue'
import type nodeData from './nodeType'

const { updateNodeData, removeEdges, findNode } = useVueFlow()
const props = defineProps(['id', 'label', 'data', 'selected'])
const varNameRef = computed(() => {
  if (selectedCmd.value) {
    return selectedCmd.value.cmd
  } else {
    return 'null_cmd'
  }
})
const varValueRef = computed({
  get() {
    if (nodesData.value) {
      varValDisabled.value = true
      return nodesData.value.pValue.value
    } else {
      varValDisabled.value = false
      return driverNodeData.pValue.value
    }
  },
  set(newValue) {
    if (driverNodeData) {
      driverNodeData.pValue.value = newValue
    } else if (nodesData.value) {
      //nodesData.value.data.varVal = newValue
    }
  },
})
const varValDisabled = ref(false)
const requiresVarValue = ref(false)

const selectedCmd = ref()
const countries = ref([
  {
    cmdgroup: 'Document',
    group: [
      {
        cmd: 'get',
        isValueRequired: true,
      },
      {
        cmd: 'getTitle',
        isValueRequired: true,
        isGetOnly: true,
      },
      {
        cmd: 'getConstantURL',
        isValueRequired: true,
        isGetOnly: true,
      },
    ],
  },
  {
    cmdgroup: 'DOM',
    group: [
      {
        cmd: 'click',
        isValueRequired: true,
      },
      {
        cmd: 'left-click',
        isValueRequired: true,
      },
      {
        cmd: 'double-click',
        isValueRequired: true,
      },
      {
        cmd: 'drag',
      },
    ],
  },
  {
    cmdgroup: 'Page',
    group: [
      {
        cmd: 'back',
      },
      {
        cmd: 'forward',
      },
      {
        cmd: 'refresh',
      },
    ],
  },
  {
    cmd: 'Start',
  },
])
const cascadeSelect_dt = {
  root: {
    paddingX: '0.4rem',
    paddingY: '0.3rem', // borderRadius: '0.15rem'
  },
  option: {
    padding: '0.3rem 0.3rem',
  },
}
const cascadeSelect_pt = {
  root: {
    class: '', //border-0
  },
  dropdown: {
    class: 'w-[1.5rem]',
  },
  dropdownIcon: {
    class: 'w-[10px] h-[10px]',
  },
}

onBeforeMount(() => {
  console.log(selectedCmd.value)
  if (driverNodeData.pCmd?.value === 'get') {
    requiresVarValue.value = true
    selectedCmd.value = { cmd: driverNodeData.pCmd?.value, isValueRequired: true }
    //updatePostion()
  } else if (driverNodeData.pCmd?.value === 'Start') {
    selectedCmd.value = { cmd: driverNodeData.pCmd?.value }
    //updatePostion()
  }
  console.log(selectedCmd.value)
  /* if (driverNodeData.pValue.isRequired) {
    if (driverNodeData.pValue.isConnected) {
      nodesData.value = useNodesData(driverNodeData.pValue.connnectedNodeId)
    }
  } */
})

function updatePostion() {
  const newData = findNode(props.id)
  const pos: any = newData?.position
  //pos.x = 0
  //pos.y = 0
  console.log(pos)
  if (newData) {
    newData.position = pos
  }
}

const driverNodeData: nodeData = useNodesData(props.id).value?.data
/* watch(varValueRef, (newVal, oldVal) => {
  if (driverNodeData.value) {
    driverNodeData.value.data.varVal = newVal
  }
})
 */
const connections = useHandleConnections({
  type: 'target',
  id: 'var-set',
  onConnect: (connection) => {
    if (connection[0].sourceHandle === 'var-get') {
      driverNodeData.pValue.isConnected = true
      driverNodeData.pValue.connnectedNodeId = connection[0].source
    }
  },
  onDisconnect: (connection) => {
    driverNodeData.pValue.isConnected = false
    driverNodeData.pValue.connnectedNodeId = '-1'
  },
})

let data = useNodesData(() => connections.value.map((connection) => connection.source))
const nodesData = computed<nodeData | null | any>(() => {
  console.log(data.value)
  if (data.value.length > 0) {
    return data.value[0].data
  } else {
    return null
  }
})

function onDropdownItemSelected(curCmd: any) {
  console.log(curCmd)
  if (curCmd.isValueRequired === true) {
    callNodeDataUpdate(curCmd.cmd)
    driverNodeData.pValue.isRequired = true
    requiresVarValue.value = true
    if (curCmd.isGetOnly === true) {
      if (nodesData.value) {
        removeEdges(connections.value[0].edgeId)
      }
    }
  } else {
    if (nodesData.value) {
      removeEdges(connections.value[0].edgeId)
    }
    driverNodeData.pValue.isRequired = false
    requiresVarValue.value = false
    callNodeDataUpdate(curCmd.cmd)
  }
  console.log(connections.value.map((connection) => connection.source))
  //console.log(nodesData.value[0].type)

  //dropdownOpen.value = false
}
function callNodeDataUpdate(newCmd: string) {
  if (driverNodeData.pCmd) {
    driverNodeData.pCmd.value = newCmd
  }
}
const requiresVarSetHandle = computed(() => {
  if (selectedCmd.value) {
    if (selectedCmd.value.isValueRequired === true) {
      /* if (selectedCmd.value.isGetOnly === true) {
        return false
      } else {
        console.log(`${selectedCmd} varhandle`)
        return true
      } */
      return true
    } else {
      return false
    }
  } else {
    return false
  }
})
const isVarInputDisabled = computed(() => {
  if (selectedCmd.value) {
    if (selectedCmd.value.isValueRequired === true) {
      if (selectedCmd.value.isGetOnly === true) {
        return true
      } else {
        console.log(`${selectedCmd} varinput`)
        if (varValDisabled.value === true) {
          return true
        } else {
          return false
        }
      }
    }
  } else {
    return false
  }
})
</script>
<template>
  <div class="node-container" :class="{ 'node-container-highlight': props.selected }">
    <div class="node-heading">Driver Node</div>
    <div class="node-content">
      <Handle
        type="target"
        :position="Position.Left"
        id="var-set"
        style="top: 118px; background-color: yellow; border-color: yellow"
        v-show="requiresVarSetHandle"
      />
      <div class="">
        <div>
          <p class="mb-1">Command</p>
          <div
            v-tooltip.top="{
              value: 'Command to execute',
              class: 'text-xs1 leading-xs1',
              showDelay: '500',
            }"
          >
            <CascadeSelect
              v-model="selectedCmd"
              :options="countries"
              optionGroupLabel="cmdgroup"
              optionLabel="cmd"
              :optionGroupChildren="['group']"
              class="w-full"
              placeholder="Select a Command"
              appendTo="self"
              :pt="cascadeSelect_pt"
              :dt="cascadeSelect_dt"
              @update:modelValue="onDropdownItemSelected"
            >
            </CascadeSelect>
          </div>
        </div>
        <div class="text-xs" v-show="requiresVarValue">
          <p class="mt-2 mb-1">{{ varNameRef }}</p>
          <InputText
            type="text"
            v-model="varValueRef"
            class="text-xs py-[0.3rem] px-[0.4rem] w-full"
            :disabled="isVarInputDisabled"
          />
        </div>
        <div class="flex justify-between mb-1">
          <p class="">
            <Handle
              type="target"
              :position="Position.Left"
              id="flow-prev"
              style="
                position: relative;
                left: -12px;
                top: 15px;
                background-color: yellow;
                border-color: yellow;
              "
            />
            Previous
          </p>
          <p class="">
            <Handle
              type="source"
              :position="Position.Right"
              id="flow-next"
              style="
                position: relative;
                right: -32px;
                top: 15px;
                background-color: limegreen;
                border-color: limegreen;
              "
            />
            Next
          </p>
        </div>
      </div>
      <Handle
        type="source"
        :position="Position.Right"
        id="var-get"
        style="top: 118px; background-color: limegreen; border-color: limegreen"
        v-show="requiresVarValue"
      />
    </div>
  </div>
</template>
<style scoped>
.node-container {
  @apply text-xs;
}
.node-container-highlight {
  @apply outline outline-1 outline-primary;
}
.node-heading {
  @apply h-5 w-[163px] bg-mblue-def text-white ps-3 py-0.5;
}
.node-content {
  @apply h-fit w-[163px] bg-surface-200 dark:bg-surface-800
    shadow-surface-300 dark:shadow-surface-700 shadow-inner
    px-3 py-2 flex flex-col;
}
</style>
