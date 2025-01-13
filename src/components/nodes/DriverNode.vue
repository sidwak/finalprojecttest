<script setup lang="ts">
import {
  Handle,
  Position,
  useVueFlow,
  useNodesData,
  useHandleConnections,
  type GraphNode,
} from '@vue-flow/core'
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
import type { NodeType } from '@/ts_types/nodeType'

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
    if (connectedNodePara1Data.value) {
      return connectedNodePara1Data.value.nodeData.para1?.value
    } else {
      return driverNodeData.nodeData.para1?.value
    }
  },
  set(newValue) {
    if (driverNodeData && newValue) {
      driverNodeData.nodeData.para1!.value = newValue
    } else if (connectedNodePara1Data.value) {
      //nodesData.value.data.varVal = newValue
    }
  },
})
const varStateRef = ref<fieldState>(fieldState.Hidden)
const varSetHandleState = ref<fieldState>(fieldState.Block)
const dominInputRef = computed({
  get() {
    if (connectedNodePara2Data.value) {
      return connectedNodePara2Data.value.nodeData.para1?.value
    } else {
      return driverNodeData.nodeData.para2?.value
    }
  },
  set(newValue) {
    if (driverNodeData && newValue) {
      driverNodeData.nodeData.para2!.value = newValue
    } else if (connectedNodePara2Data.value) {
      //nodesData.value.data.varVal = newValue
    }
  },
})
const dominStateRef = ref<fieldState>(fieldState.Hidden)
const selectedCmd = ref()
const commandsList = ref([
  {
    cmdgroup: 'Document',
    group: [
      {
        cmd: 'get',
        isValueRequired: true,
        isGetOnly: false,
        isDominRequired: false,
      },
      {
        cmd: 'getTitle',
        isValueRequired: true,
        isGetOnly: true,
        isDominRequired: false,
      },
      {
        cmd: 'getConstantURL',
        isValueRequired: true,
        isGetOnly: true,
        isDominRequired: false,
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
        isDominRequired: false,
      },
      {
        cmd: 'input',
        isValueRequired: true,
        isDominRequired: true,
        isGetOnly: false,
      },
      {
        cmd: 'left-click',
        isValueRequired: true,
        isGetOnly: false,
        isDominRequired: false,
      },
      {
        cmd: 'double-click',
        isValueRequired: true,
        isGetOnly: false,
        isDominRequired: false,
      },
      {
        cmd: 'drag',
        isValueRequired: true,
        isGetOnly: false,
        isDominRequired: false,
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
        isDominRequired: false,
      },
      {
        cmd: 'forward',
        isValueRequired: false,
        isGetOnly: false,
        isDominRequired: false,
      },
      {
        cmd: 'refresh',
        isValueRequired: false,
        isGetOnly: false,
        isDominRequired: false,
      },
    ],
  },
  {
    cmd: 'Start',
    isValueRequired: false,
    isGetOnly: false,
    isDominRequired: false,
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
const driverNodeData: NodeType = useNodesData(props.id).value?.data
/* const data = useNodesData(() => connectionPara1.value.map((connection) => connection.source))
const connectedNodesData = computed(() => {
  console.log(data.value)
  if (data.value.length > 0) {
    const nodesList: NodeType[] = []
    data.value.forEach((nodeData) => {
      if (nodeData.type === 'var-node') {
        connectedNodePara1Data.value = nodeData.data
      }
      if (nodeData.type === 'dom-node') {
        //connectedNodePara2Data.value = nodeData.data
      }
      nodesList.push(nodeData.data)
    })
    return nodesList as NodeType[]
  } else {
    return null
  }
}) */
const connectedPara1HandleData = useNodesData(() =>
  connectionPara1.value.map((connection) => connection.source),
)
const connectedNodePara1Data = computed(() => {
  if (connectedPara1HandleData.value.length > 0) {
    return connectedPara1HandleData.value[0].data
  } else {
    return null
  }
})
const connectedPara2HandleData = useNodesData(() =>
  connectionPara2.value.map((connection) => connection.source),
)
const connectedNodePara2Data = computed(() => {
  if (connectedPara2HandleData.value.length > 0) {
    return connectedPara2HandleData.value[0].data
  } else {
    return null
  }
})

//#endregion
onBeforeMount(() => {
  if (driverNodeData.nodeData.cmd?.value !== 'cmd not set') {
    // only set when loading node from data not while adding new
    let isDominReq = false
    if (driverNodeData.nodeData.para2) {
      if (driverNodeData.nodeData.para2.isRequired) {
        isDominReq = true
      }
    }
    selectedCmd.value = {
      cmd: driverNodeData.nodeData.cmd?.value,
      isValueRequired: driverNodeData.nodeData.cmd?.isRequired,
      isGetOnly: driverNodeData.nodeData.cmd?.isGetOnly,
      isDominRequired: isDominReq,
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
const connectionPara1 = useHandleConnections({
  type: 'target',
  id: 'var-set',
  onConnect: (connection) => {
    console.log(connection)
    if (connection[0].sourceHandle === 'var-get') {
      driverNodeData.nodeData.para1!.isConnected = true
      driverNodeData.nodeData.para1!.connectedNodeId = connection[0].source
      driverNodeData.nodeData.para1!.edgeId = connection[0].edgeId
      updateFieldsState()
    }
  },
  onDisconnect: (connection) => {
    if (driverNodeData.nodeData.para1) {
      driverNodeData.nodeData.para1.isConnected = false
      driverNodeData.nodeData.para1.connectedNodeId = '-1'
      driverNodeData.nodeData.para1.edgeId = '-1'
      updateFieldsState()
    }
  },
})
const connectionPara2 = useHandleConnections({
  type: 'target',
  id: 'domin-set',
  onConnect: (connection) => {
    if (connection[0].sourceHandle === 'var-get') {
      if (driverNodeData.nodeData.para2) {
        driverNodeData.nodeData.para2!.isConnected = true
        driverNodeData.nodeData.para2!.connectedNodeId = connection[0].source
        driverNodeData.nodeData.para2!.edgeId = connection[0].edgeId
        updateFieldsState()
      } else {
        driverNodeData.nodeData.para2 = {
          isConnected: true,
          isRequired: true,
          connectedNodeId: connection[0].source,
          edgeId: connection[0].edgeId,
          value: 'value not set',
        }
        updateFieldsState()
      }
    }
  },
  onDisconnect: (connection) => {
    if (driverNodeData.nodeData.para2) {
      driverNodeData.nodeData.para2.isConnected = false
      driverNodeData.nodeData.para2.connectedNodeId = '-1'
      driverNodeData.nodeData.para2.edgeId = '-1'
      updateFieldsState()
    }
  },
})

function updateFieldsState() {
  if (selectedCmd.value && driverNodeData.nodeData.para1) {
    if (selectedCmd.value.isGetOnly) {
      varSetHandleState.value = fieldState.Hidden
    } else {
      varSetHandleState.value = fieldState.Block
    }
    if (driverNodeData.nodeData.para1.isConnected == true) {
      varStateRef.value = selectedCmd.value.isValueRequired ? fieldState.Grayed : fieldState.Hidden
    } else {
      varStateRef.value = selectedCmd.value.isValueRequired ? fieldState.Block : fieldState.Hidden
      varStateRef.value = selectedCmd.value.isGetOnly ? fieldState.Grayed : varStateRef.value
    }
    if (selectedCmd.value.cmd === 'input') {
      if (driverNodeData.nodeData.para2?.isConnected == true) {
        dominStateRef.value = fieldState.Grayed
      } else {
        dominStateRef.value = fieldState.Block
      }
    } else {
      dominStateRef.value = fieldState.Hidden
    }
  }
}

function onDropdownItemSelected(curCmd: any) {
  console.log(curCmd)
  callNodeDataUpdate(curCmd)
  if (driverNodeData.nodeData.para1) {
    if (curCmd.isValueRequired === true) {
      driverNodeData.nodeData.para1.isRequired = true
      if (curCmd.isGetOnly === true) {
        removeUnconnectedEdges()
      }
    } else {
      removeUnconnectedEdges()
      driverNodeData.nodeData.para1.isRequired = false
    }
  }
  updateFieldsState()
}
function removeUnconnectedEdges() {
  if (driverNodeData.nodeData.para1?.isConnected === true) {
    removeEdges(driverNodeData.nodeData.para1.edgeId)
  }
}
function callNodeDataUpdate(newCmd: any) {
  if (driverNodeData.nodeData.cmd) {
    driverNodeData.nodeData.cmd.value = newCmd.cmd
    driverNodeData.nodeData.cmd.isRequired = newCmd.isValueRequired
    driverNodeData.nodeData.cmd.isGetOnly = newCmd.isGetOnly
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
          v-show="varSetHandleState !== fieldState.Hidden"
        /><!-- v-show="varStateRef !== fieldState.Grayed" -->
        <Handle
          type="source"
          :position="Position.Right"
          id="var-get"
          style="top: 118px; background-color: limegreen; border-color: limegreen"
        />
      </div>
      <div v-show="dominStateRef === fieldState.Block || dominStateRef === fieldState.Grayed">
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
              :options="commandsList"
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
        <div v-show="dominStateRef === fieldState.Block || dominStateRef === fieldState.Grayed">
          <p class="mt-2 mb-1">DOM Input</p>
          <InputText
            type="text"
            v-model="dominInputRef"
            class="text-xs py-[0.3rem] px-[0.4rem] w-full"
            :disabled="dominStateRef === fieldState.Grayed"
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
                right: -31px;
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
