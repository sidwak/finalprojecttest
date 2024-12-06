<script setup lang="ts">
import { Handle, Position, useVueFlow, useNodesData, useHandleConnections } from '@vue-flow/core'
import { ref, onMounted, onUnmounted, shallowRef, computed } from 'vue'
import Get_c from '.././node_components/get_c.vue'
import GetTitle_c from '.././node_components/getTitle_c.vue'
import { CascadeSelect } from 'primevue'

const { updateNodeData } = useVueFlow()
const props = defineProps(['id', 'label', 'cmd', 'curSelectedNodeId', 'selected'])
const curCmdCompo = shallowRef(Get_c)
const dropdownOpen = ref(false)
const dropdownString = ref('nocmd...')
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}
const dropdownItems = ref([
  { text: 'get', href: 'onDropdownItemSelected(get)' },
  { text: 'getTitle', href: 'javascript:void(0)' },
  { text: 'getConstantURL', href: 'javascript:void(0)' },
  { text: 'refresh', href: 'javascript:void(0)' },
])
const itttems = ref(['hello', 'world', 'this', 'front'])
const selectedCity = ref()
const countries = ref([
  {
    cmdgroup: 'Document',
    group: [
      {
        cmd: 'get',
      },
      {
        cmd: 'getTitle',
      },
      {
        cmd: 'getConstantURL',
      },
    ],
  },
  {
    cmdgroup: 'DOM',
    group: [
      {
        cmd: 'click',
      },
      {
        cmd: 'left-click',
      },
      {
        cmd: 'double-click',
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

const connections = useHandleConnections({
  type: 'target',
  id: 'trg_main',
})

const data = useNodesData(() => connections.value.map((connection) => connection.source))
const nodesData = computed(() => {
  console.log(data.value)
  return data.value
})

function onDropdownItemSelected(curCmd: any) {
  //dropdownString.value = curCmd
  if (curCmd.cmd === 'get') {
    curCmdCompo.value = Get_c
    callNodeDataUpdate(curCmd.cmd)
  }
  if (curCmd.cmd === 'getTitle') {
    curCmdCompo.value = GetTitle_c
    callNodeDataUpdate(curCmd.cmd)
  }
  console.log(connections.value.map((connection) => connection.source))
  console.log(nodesData.value[0].type)

  //dropdownOpen.value = false
}
function callNodeDataUpdate(newCmd: String) {
  updateNodeData(props.id, { cmd: newCmd })
}
</script>
<template>
  <div class="node-container" :class="{ 'node-container-highlight': props.selected }">
    <div class="node-heading">Driver Node</div>
    <div class="node-content">
      <Handle
        type="target"
        :position="Position.Left"
        id="trg_main"
        style="top: 148px; background-color: yellow; border-color: yellow"
      />
      <Handle
        type="target"
        :position="Position.Left"
        id="trg_2"
        style="top: 118px; background-color: yellow; border-color: yellow"
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
              v-model="selectedCity"
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
        <component :is="curCmdCompo" />
        <div class="flex justify-between mt-2 mb-1">
          <p class="">Previous</p>
          <p class="">Next</p>
        </div>
      </div>
      <Handle
        type="source"
        :position="Position.Right"
        id="src_main"
        style="top: 148px; background-color: lime; border-color: lime"
      />
      <Handle
        type="source"
        :position="Position.Right"
        id="src_2"
        style="top: 118px; background-color: lime; border-color: lime"
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
