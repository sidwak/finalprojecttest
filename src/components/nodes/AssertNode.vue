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
import type { NodeType } from '@/ts_types/nodeType'
enum fieldState {
  Hidden,
  Block,
  Grayed,
}

//#region Props
const props = defineProps<{
  id: string
  data: NodeType
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
const var1StateRef = ref<fieldState>(fieldState.Block)
const commandsList = ref([
  {
    cmdgroup: 'Compare',
    group: [
      {
        cmd: 'equal',
      },
      {
        cmd: 'notEqual',
      },
      {
        cmd: 'greaterThan',
      },
      {
        cmd: 'lessThan',
      },
    ],
  },
  {
    cmdgroup: 'Value',
    group: [
      {
        cmd: 'true',
      },
      {
        cmd: 'false',
      },
      {
        cmd: 'null',
      },
      {
        cmd: 'empty',
      },
    ],
  },
  {
    cmdgroup: 'Length',
    group: [
      {
        cmd: 'lengthAbove',
      },
      {
        cmd: 'lengthBelow',
      },
    ],
  },
  {
    cmd: 'Type',
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
      return para1ConnectedNode.value!.data.nodeData.para1!.value
    } else {
      return assertNodeData.nodeData.para1!.value
    }
  },
  set(newValue: string) {
    if (para1ConnectedNode.value) {
    } else {
      assertNodeData.nodeData.para1!.value = newValue
    }
  },
})

const para1Connection = useHandleConnections({
  type: 'target',
  id: 'var-set',
  onConnect: (connection) => {
    if (connection[0].sourceHandle === 'var-get') {
      console.log('node set connected on assert')
      para1ConnectedNodeId.value = connection[0].source
      console.log(para1ConnectedNode.value)
      //assertNodeData.nodeData.para1!.value = para1ConnectedNode.nodeData.para1!.value
      updateFieldsState()
    }
  },
  onDisconnect: (connection) => {
    console.log('node set disconnected on assert')
    if (para1ConnectedNode) {
      para1ConnectedNodeId.value = '-1'
      updateFieldsState()
    }
  },
})

function updateFieldsState() {
  if (para1ConnectedNode.value) {
    var1StateRef.value = fieldState.Grayed
  } else {
    var1StateRef.value = fieldState.Block
  }
}

function onDropdownItemSelected(curCmd: any) {
  console.log(curCmd)
  if (props.data.nodeData.cmd) {
    props.data.nodeData.cmd!.value = curCmd.cmd
  } else {
    props.data.nodeData.cmd = {
      value: curCmd.cmd,
      isGetOnly: false,
      isRequired: true,
    }
  }
}
</script>
<template>
  <div class="node-container" :class="{ 'node-container-highlight': props.selected }">
    <div class="node-heading">Assert Node</div>
    <div class="node-content">
      <Handle
        type="target"
        :position="Position.Left"
        id="var-set"
        style="top: 119px; background-color: mediumaquamarine; border-color: mediumaquamarine"
      />
      <Handle
        type="source"
        :position="Position.Right"
        id="var-get"
        style="top: 119px; background-color: lime; border-color: lime"
      />
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
        <div>
          <p class="mt-2 mb-1">Value 2</p>
          <InputText
            type="text"
            v-model="props.data.nodeData.para1!.value"
            class="text-xs py-[0.3rem] px-[0.4rem] w-full"
            :disabled="var1StateRef === fieldState.Grayed"
          />
        </div>
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
