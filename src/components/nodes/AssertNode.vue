<script setup lang="ts">
import { Handle, Position, useVueFlow, useNodesData, useHandleConnections } from '@vue-flow/core'
import { ref, reactive, onMounted, onUnmounted, shallowRef, computed, watch, onBeforeMount } from 'vue'
import { CascadeSelect, InputText } from 'primevue'
import type { NodeType } from '@/ts_types/nodeType'
import { EExeState, useRunnerStore } from '@/pinia_stores/runnerStore'
import { useUtilsStore } from '@/pinia_stores/utilsStore'
import './nodeStyles.css'
enum fieldState {
  Hidden,
  Block,
  Grayed,
}
const { removeEdges } = useVueFlow()
const runnerStore = useRunnerStore()
const utilsStore = useUtilsStore()

//#region Props
const props = defineProps<{
  id: string
  data: NodeType | any
  selected: boolean
}>()
//#endregion
//#region Refs
const selectedCmd = ref()
const varNameRef = computed(() => {
  if (selectedCmd.value) {
    return selectedCmd.value.cmd
  } else {
    return 'select a option'
  }
})
const varInputRef = ref()
const var1StateRef = ref<fieldState>(fieldState.Hidden)
const var2StateRef = ref<fieldState>(fieldState.Hidden)
const executedState = ref<EExeState>(EExeState.Normal)
const commandsList = ref([
  {
    cmdgroup: 'Compare',
    group: [
      {
        cmd: 'equal',
        isVar2Required: true,
      },
      {
        cmd: 'notEqual',
        isVar2Required: true,
      },
      {
        cmd: 'greaterThan',
        isVar2Required: true,
      },
      {
        cmd: 'lessThan',
        isVar2Required: true,
      },
    ],
  },
  {
    cmdgroup: 'Value',
    group: [
      {
        cmd: 'true',
        isVar2Required: false,
      },
      {
        cmd: 'false',
        isVar2Required: false,
      },
      {
        cmd: 'null',
        isVar2Required: false,
      },
      {
        cmd: 'empty',
        isVar2Required: false,
      },
    ],
  },
  {
    cmdgroup: 'Length',
    group: [
      {
        cmd: 'lengthAbove',
        isVar2Required: true,
      },
      {
        cmd: 'lengthBelow',
        isVar2Required: true,
      },
    ],
  },
  {
    cmd: 'Type',
    isVar2Required: true,
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
//#region Vueflow
const assertNodeData: NodeType = useNodesData(props.id).value?.data
const para1ConnectedNodeId = ref('-1')
const para1ConnectedNode = useNodesData(para1ConnectedNodeId) // .value?.data gives undefined (dont' know why?), can use computed() to cal further
const para1InputRef = computed({
  get() {
    if (para1ConnectedNode.value) {
      return para1ConnectedNode.value!.data.nodeData.para1.value
    } else {
      return assertNodeData.nodeData.para1.value
    }
  },
  set(newValue: string) {
    if (para1ConnectedNode.value) {
    } else {
      assertNodeData.nodeData.para1.value = newValue
    }
  },
})

const para1Connection = useHandleConnections({
  type: 'target',
  id: 'var-set',
  onConnect: (connection) => {
    if (connection[0].sourceHandle === 'var-get') {
      para1ConnectedNodeId.value = connection[0].source
      assertNodeData.nodeData.para1.connectedNodeId = connection[0].source
      assertNodeData.nodeData.para1.edgeId = connection[0].edgeId
      assertNodeData.nodeData.para1.isConnected = true
      //assertNodeData.nodeData.para1!.value = para1ConnectedNode.nodeData.para1!.value
      updateFieldsState()
    }
  },
  onDisconnect: (connection) => {
    if (para1ConnectedNode) {
      para1ConnectedNodeId.value = '-1'
      assertNodeData.nodeData.para1.connectedNodeId = '-1'
      assertNodeData.nodeData.para1.edgeId = '-1'
      assertNodeData.nodeData.para1.isConnected = false
      updateFieldsState()
    }
  },
})
const para2ConnectedNodeId = ref('-1')
const para2ConnectedNode = useNodesData(para2ConnectedNodeId)
const para2InputRef = computed({
  get() {
    if (para2ConnectedNode.value) {
      return para2ConnectedNode.value!.data.nodeData.para1.value
    } else {
      return assertNodeData.nodeData.para2.value
    }
  },
  set(newValue: string) {
    if (para2ConnectedNode.value) {
    } else {
      assertNodeData.nodeData.para2.value = newValue
    }
  },
})
const para2Connection = useHandleConnections({
  type: 'target',
  id: 'var2-set',
  onConnect: (connection) => {
    if (connection[0].sourceHandle === 'var-get') {
      para2ConnectedNodeId.value = connection[0].source
      assertNodeData.nodeData.para2.connectedNodeId = connection[0].source
      assertNodeData.nodeData.para2.edgeId = connection[0].edgeId
      assertNodeData.nodeData.para2.isConnected = true
      //assertNodeData.nodeData.para1!.value = para1ConnectedNode.nodeData.para1!.value
      updateFieldsState()
    }
  },
  onDisconnect: (connection) => {
    if (para2ConnectedNode) {
      para2ConnectedNodeId.value = '-1'
      assertNodeData.nodeData.para2.connectedNodeId = '-1'
      assertNodeData.nodeData.para2.edgeId = '-1'
      assertNodeData.nodeData.para2.isConnected = false
      updateFieldsState()
    }
  },
})

const connectionGetPara1 = useHandleConnections({
  type: 'source',
  id: 'var-get',
})
const connectedGetPara1HandleData = useNodesData(() => connectionGetPara1.value.map((connection) => connection.target))
const connectedNodeGetPara1Data = computed<NodeType>(() => {
  if (connectedGetPara1HandleData.value.length > 0) {
    return connectedGetPara1HandleData.value[0].data
  } else {
    return null
  }
})
watch(
  () => connectedGetPara1HandleData.value,
  (newVal, oldVal) => {
    if (newVal.length > 0) {
      const nodeData: flowNode = newVal[0] as flowNode
      if (nodeData.type === 'var-node' || nodeData.type === 'dom-node') {
        newVal[0].data.nodeData.para1.value = para1InputRef.value
      }
    }
  },
)
watch(
  () => para1InputRef.value,
  (newVal, oldVal) => {
    if (connectedGetPara1HandleData.value.length > 0) {
      if (connectedGetPara1HandleData.value[0].type === 'var-node' || connectedGetPara1HandleData.value[0].type === 'dom-node') {
        connectedGetPara1HandleData.value[0].data.nodeData.para1.value = para1InputRef.value
      }
    }
  },
)

const connectionGetPara2 = useHandleConnections({
  type: 'source',
  id: 'var2-get',
})
const connectedGetPara2HandleData = useNodesData(() => connectionGetPara2.value.map((connection) => connection.target))
const connectedNodeGetPara2Data = computed<NodeType>(() => {
  if (connectedGetPara2HandleData.value.length > 0) {
    return connectedGetPara2HandleData.value[0].data
  } else {
    return null
  }
})
watch(
  () => connectedGetPara2HandleData.value,
  (newVal, oldVal) => {
    if (newVal.length > 0) {
      const nodeData: flowNode = newVal[0] as flowNode
      if (nodeData.type === 'var-node' || nodeData.type === 'dom-node') {
        newVal[0].data.nodeData.para1.value = para2InputRef.value
      }
    }
  },
)
watch(
  () => para2InputRef.value,
  (newVal, oldVal) => {
    if (connectedGetPara2HandleData.value.length > 0) {
      if (connectedGetPara2HandleData.value[0].type === 'var-node' || connectedGetPara2HandleData.value[0].type === 'dom-node') {
        connectedGetPara2HandleData.value[0].data.nodeData.para1.value = para2InputRef.value
      }
    }
  },
)

onBeforeMount(() => {
  if (assertNodeData.nodeData.cmd?.value !== 'cmd not set') {
    let isVar2Req = false
    if (assertNodeData.nodeData.para2.isRequired) {
      isVar2Req = true
    }

    selectedCmd.value = {
      cmd: assertNodeData.nodeData.cmd!.value,
      isVar2Required: isVar2Req,
    }
    para1ConnectedNodeId.value = assertNodeData.nodeData.para1.connectedNodeId
    para2ConnectedNodeId.value = assertNodeData.nodeData.para2.connectedNodeId
    updateFieldsState()
  }
})

/* watch(
  () => runnerStore.curExecuted,
  (newVal, oldVal) => {
    checkIfCurrentNodeWasExecuted(newVal)
  },
)
watch(
  () => runnerStore.flowHighlightResetNotifier,
  (newVal, oldVal) => {
    executedState.value = EExeState.Normal
  },
)
watch(
  () => utilsStore.terminalClearNotifier,
  (newVal, oldVal) => {
    executedState.value = EExeState.Normal
  },
)

function checkIfCurrentNodeWasExecuted(execData: { id: string; exeState: EExeState }) {
  if (execData.id === props.id) {
    executedState.value = execData.exeState as EExeState
  }
} */
function getExecutedStateClass() {
  switch (props.data.exeState) {
    case EExeState.Normal:
      return 'node-normal'
    case EExeState.Error:
      return 'node-error'
    case EExeState.Success:
      return 'node-success'
    case EExeState.Warn:
      return 'node-warn'
  }
}

function updateFieldsState() {
  if (selectedCmd.value) {
    if (assertNodeData.nodeData.para1.isConnected) {
      var1StateRef.value = fieldState.Grayed
    } else {
      var1StateRef.value = fieldState.Block
    }
    if (selectedCmd.value.isVar2Required) {
      var2StateRef.value = assertNodeData.nodeData.para2.isConnected ? fieldState.Grayed : fieldState.Block
    } else {
      var2StateRef.value = fieldState.Hidden
    }
  } else {
    var1StateRef.value = fieldState.Hidden
    var2StateRef.value = fieldState.Hidden
  }
}

function removeUnconnectedEdges() {
  if (assertNodeData.nodeData.para2.isConnected === true) {
    removeEdges(assertNodeData.nodeData.para2.edgeId)
  }
  if (connectedGetPara2HandleData.value.length > 0) {
    removeEdges(connectionGetPara2.value[0].edgeId)
  }
}

function onDropdownItemSelected(curCmd: any) {
  console.log(curCmd)
  props.data.nodeData.para2.isRequired = selectedCmd.value.isVar2Required
  props.data.nodeData.cmd = {
    value: curCmd.cmd,
    isGetOnly: false,
    isRequired: true,
  }

  updateFieldsState()
  removeUnconnectedEdges()
}
</script>
<template>
  <div class="node-container" :class="[{ 'node-container-highlight': props.selected }, getExecutedStateClass()]">
    <div class="node-heading">Assert Node</div>
    <div class="node-content">
      <Handle
        type="target"
        :position="Position.Left"
        id="var-set"
        :connectable="1"
        style="top: 119px; background-color: mediumaquamarine; border-color: mediumaquamarine"
      />
      <Handle type="source" :position="Position.Right" id="var-get" style="top: 119px; background-color: lime; border-color: lime" />
      <div v-show="var2StateRef === fieldState.Block || var2StateRef === fieldState.Grayed">
        <Handle
          type="target"
          :position="Position.Left"
          id="var2-set"
          :connectable="1"
          style="top: 174px; background-color: mediumaquamarine; border-color: mediumaquamarine"
        />
        <Handle type="source" :position="Position.Right" id="var2-get" style="top: 174px; background-color: lime; border-color: lime" />
      </div>
      <div>
        <p class="mb-1">Assert Condition</p>
        <div
          v-tooltip.top="{
            value: 'Assertion to make',
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
      <div class="">
        <p class="mt-2 mb-1">Value 1</p>
        <InputText
          type="text"
          v-model="para1InputRef"
          class="text-xs py-[0.3rem] px-[0.4rem] w-full"
          :disabled="var1StateRef === fieldState.Grayed"
        />
        <!-- <p class="mt-2 mb-1">{{ varNameRef }}</p> -->
        <div v-show="var2StateRef === fieldState.Block || var2StateRef === fieldState.Grayed">
          <p class="mt-2 mb-1">Value 2</p>
          <InputText
            type="text"
            v-model="para2InputRef"
            class="text-xs py-[0.3rem] px-[0.4rem] w-full"
            :disabled="var2StateRef === fieldState.Grayed"
          />
        </div>
      </div>
      <div class="flex justify-between mb-1">
        <p class="">
          <Handle
            type="target"
            :position="Position.Left"
            id="flow-prev"
            :connectable="1"
            style="position: relative; left: -12px; top: 15px; background-color: yellow; border-color: yellow"
          />
          Previous
        </p>
        <p class="">
          <Handle
            type="source"
            :position="Position.Right"
            id="flow-next"
            :connectable="1"
            style="position: relative; right: -31px; top: 15px; background-color: limegreen; border-color: limegreen"
          />
          Next
        </p>
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
