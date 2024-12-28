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
enum fieldState {
  Hidden,
  Block,
  Grayed,
}

//#region Props
const props = defineProps(['id', 'data', 'selected'])
//#endregion
//#region Refs
const varNameRef = computed(() => {
  if (selectedCmd.value) {
    return selectedCmd.value.cmd
  } else {
    return 'null_cmd'
  }
})
const varInputRef = computed({
  get() {
    if (nodesData.value) {
      return nodesData.value.pValue.value
    } else {
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
const varStateRef = ref<fieldState>(fieldState.Hidden)
const selectedCmd = ref()
const countries = ref([
  {
    cmdgroup: 'Document',
    group: [
      {
        cmd: 'get',
        isValueRequired: true,
        isGetOnly: false,
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
        isGetOnly: false,
      },
      {
        cmd: 'input',
        isValueRequired: true,
        isGetOnly: false,
      },
      {
        cmd: 'left-click',
        isValueRequired: true,
        isGetOnly: false,
      },
      {
        cmd: 'double-click',
        isValueRequired: true,
        isGetOnly: false,
      },
      {
        cmd: 'drag',
        isValueRequired: true,
        isGetOnly: false,
      },
    ],
  },
  {
    cmdgroup: 'Page',
    group: [
      {
        cmd: 'back',
        isValueRequired: false,
        isGetOnly: false,
      },
      {
        cmd: 'forward',
        isValueRequired: false,
        isGetOnly: false,
      },
      {
        cmd: 'refresh',
        isValueRequired: false,
        isGetOnly: false,
      },
    ],
  },
  {
    cmd: 'Start',
    isValueRequired: false,
    isGetOnly: false,
  },
])
//#endregion
//#region Primevue
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
//#endregion
//#region VueFlow
const driverNodeData: nodeData = useNodesData(props.id).value?.data
let data = useNodesData(() => connections.value.map((connection) => connection.source))
const nodesData = computed<nodeData | null | any>(() => {
  console.log(data.value)
  if (data.value.length > 0) {
    return data.value[0].data
  } else {
    return null
  }
})
//#endregion
onBeforeMount(() => {
  console.log(selectedCmd.value)
  console.log(driverNodeData.pCmd?.value)
  if (driverNodeData.pCmd?.value !== 'cmd not set') {
    // only set when loading node from data not while adding new
    selectedCmd.value = {
      cmd: driverNodeData.pCmd?.value,
      isValueRequired: driverNodeData.pCmd?.isValueRequired,
      isGetOnly: driverNodeData.pCmd?.isGetOnly,
    }
  }
  updateFieldsState()
})

/* watch(varInputRef, (newVal, oldVal) => {
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
      driverNodeData.pValue.edgeId = connection[0].edgeId
      updateFieldsState()
    }
  },
  onDisconnect: (connection) => {
    driverNodeData.pValue.isConnected = false
    driverNodeData.pValue.connnectedNodeId = '-1'
    driverNodeData.pValue.edgeId = '-1'
    updateFieldsState()
  },
})

function updateFieldsState() {
  if (selectedCmd.value) {
    if (driverNodeData.pValue.isConnected == true) {
      varStateRef.value = selectedCmd.value.isValueRequired ? fieldState.Grayed : fieldState.Hidden
    } else {
      varStateRef.value = selectedCmd.value.isValueRequired ? fieldState.Block : fieldState.Hidden
      varStateRef.value = selectedCmd.value.isGetOnly ? fieldState.Grayed : varStateRef.value
    }
  }
  console.log(`varStateRef: ${varStateRef.value}`)
}

function onDropdownItemSelected(curCmd: any) {
  console.log(curCmd)
  callNodeDataUpdate(curCmd)
  if (curCmd.isValueRequired === true) {
    driverNodeData.pValue.isRequired = true
    if (curCmd.isGetOnly === true) {
      removeUnconnectedEdges()
    }
  } else {
    removeUnconnectedEdges()
    driverNodeData.pValue.isRequired = false
  }
  console.log(connections.value.map((connection) => connection.source))
  updateFieldsState()
  //console.log(nodesData.value[0].type)
}
function removeUnconnectedEdges() {
  if (driverNodeData.pValue.isConnected === true) {
    removeEdges(driverNodeData.pValue.edgeId)
  }
}
function callNodeDataUpdate(newCmd: any) {
  if (driverNodeData.pCmd) {
    driverNodeData.pCmd.value = newCmd.cmd
    driverNodeData.pCmd.isValueRequired = newCmd.isValueRequired
    driverNodeData.pCmd.isGetOnly = newCmd.isGetOnly
  }
}
</script>
<template>
  <div class="node-container" :class="{ 'node-container-highlight': props.selected }">
    <div class="node-heading">Driver Node</div>
    <div class="node-content">
      <div v-show="varStateRef === fieldState.Block || varStateRef === fieldState.Grayed">
        <Handle
          type="target"
          :position="Position.Left"
          id="var-set"
          style="top: 118px; background-color: yellow; border-color: yellow"
          v-show="varStateRef !== fieldState.Grayed"
        />
        <Handle
          type="source"
          :position="Position.Right"
          id="var-get"
          style="top: 118px; background-color: limegreen; border-color: limegreen"
        />
      </div>
      <div>
        <Handle
          type="target"
          :position="Position.Left"
          id="domin-set"
          style="top: 173px; background-color: yellow; border-color: yellow"
        />
        <Handle
          type="source"
          :position="Position.Right"
          id="domin-get"
          style="top: 173px; background-color: limegreen; border-color: limegreen"
        />
      </div>
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
        <div
          class=""
          v-show="varStateRef === fieldState.Block || varStateRef === fieldState.Grayed"
        >
          <p class="mt-2 mb-1">{{ varNameRef }}</p>
          <InputText
            type="text"
            v-model="varInputRef"
            class="text-xs py-[0.3rem] px-[0.4rem] w-full"
            :disabled="varStateRef === fieldState.Grayed"
          />
        </div>
        <div>
          <p class="mt-2 mb-1">DOM Input</p>
          <InputText type="text" class="text-xs py-[0.3rem] px-[0.4rem] w-full" />
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
