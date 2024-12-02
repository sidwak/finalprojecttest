<script setup lang="ts">
import { Position, Handle } from '@vue-flow/core'
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'
import Get_c from '.././node_components/get_c.vue'
import GetTitle_c from '.././node_components/getTitle_c.vue'
import { CascadeSelect } from 'primevue'

const props = defineProps({
  label: String,
})
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

function onDropdownItemSelected(curCmd: any) {
  //dropdownString.value = curCmd
  if (curCmd.cmd === 'get') {
    curCmdCompo.value = Get_c
  }
  if (curCmd.cmd === 'getTitle') {
    curCmdCompo.value = GetTitle_c
  }
  //dropdownOpen.value = false
}
</script>
<template>
  <div class="text-xs">
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
          <!-- <button
            @click="toggleDropdown"
            class="flex items-center w-full px-1 py-0 dark:bg-dark-2 rounded-sm bg-mbackground-500"
          >
            {{ dropdownString }}
            <span class="absolute right-4">
              <svg
                width="10"
                height="10"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="fill-current"
              >
                <path
                  d="M10 14.25C9.8125 14.25 9.65625 14.1875 9.5 14.0625L2.3125 7C2.03125 6.71875 2.03125 6.28125 2.3125 6C2.59375 5.71875 3.03125 5.71875 3.3125 6L10 12.5312L16.6875 5.9375C16.9688 5.65625 17.4063 5.65625 17.6875 5.9375C17.9687 6.21875 17.9687 6.65625 17.6875 6.9375L10.5 14C10.3437 14.1563 10.1875 14.25 10 14.25Z"
                />
              </svg>
            </span>
          </button> -->
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
          <div
            v-show="dropdownOpen"
            class="shadow-lg dark:shadow-box-dark absolute z-40 w-[104px] bg-dark dark:bg-dark-2 transition-all"
            :class="{
              'top-[51px] opacity-100 visible': dropdownOpen,
              'top-[110%] invisible opacity-0': !dropdownOpen,
            }"
          >
            <template v-for="(item, index) in dropdownItems" :key="index">
              <button
                v-if="item.href"
                @click="onDropdownItemSelected(item.text)"
                class="block px-1 bg-mbackground-500 hover:bg-mbackground-700 w-full text-left"
              >
                {{ item.text }}
              </button>
            </template>
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
.node-heading {
  @apply h-5 w-[163px] bg-mblue-def text-white rounded-t-sm ps-3 py-0.5;
}
.node-content {
  @apply h-fit w-[163px] bg-surface-200 dark:bg-surface-800
    shadow-surface-300 dark:shadow-surface-700 shadow-inner
    px-3 py-2 flex flex-col;
}
</style>
