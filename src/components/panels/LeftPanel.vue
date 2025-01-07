<script setup lang="ts">
import PanelMenu from 'primevue/panelmenu'
import ContextMenu from 'primevue/contextmenu'
import { ref, useTemplateRef } from 'vue'
import { useProjectsInfoStore } from '@/pinia_stores/projectsInfoStore'
import 'primeicons/primeicons.css'

const projectsInfoStore = useProjectsInfoStore()
const items = ref([
  {
    label: 'Nodes',
    icon: 'pi pi-ticket',
    items: [
      {
        label: 'Node1',
        command: () => {
          addItem()
        },
      },
      {
        label: 'Node2',
      },
      {
        label: 'Node3',
      },
      {
        label: 'Node4',
      },
      {
        label: 'Node5',
      },
    ],
  },
  {
    label: 'Variables',
    icon: 'pi pi-database',
    items: [
      {
        label: 'Var1',
        command: (e: any) => {
          selectedItem(e)
        },
      },
      {
        label: 'Var2',
      },
      {
        label: 'Var3',
      },
      {
        label: 'Var4',
      },
      {
        label: 'Var5',
      },
    ],
    command: (e: any) => {
      selectedItem(e)
    },
  },
  {
    label: 'DOM Elements',
    icon: 'pi pi-file-word',
    items: [
      {
        label: 'tag1',
      },
      {
        label: 'tag2',
      },
      {
        label: 'tag3',
      },
      {
        label: 'tag4',
      },
      {
        label: 'tag5',
      },
    ],
  },
  {
    label: 'Test Cases',
    icon: 'pi pi-code',
    items: [
      {
        label: 'testcase1',
      },
      {
        label: 'testcase2',
      },
      {
        label: 'testcase3',
      },
      {
        label: 'testcase4',
      },
      {
        label: 'testcase5',
      },
    ],
  },
  {
    label: 'Projects',
    icon: 'pi pi-file',
    //items: projectsInfoStore.projectsList,
  },
])
const contextMenuItems = ref([
  {
    label: 'New',
    icon: 'pi pi-file',
    command: () => {
      contextMenuItems.value = contextMenuItems2.value
    },
  },
  {
    label: 'Open',
  },
  {
    label: 'Delete',
  },
])
const contextMenuItems2 = ref([
  {
    label: 'Undo',
  },
  {
    label: 'Redo',
  },
])
const contextMenuItems3 = ref([
  {
    label: 'New',
    icon: 'pi pi-file',
    command: () => {
      contextMenuItems.value = contextMenuItems2.value
    },
  },
  {
    label: 'Open',
  },
  {
    label: 'Delete',
  },
])
const contextMenuRef = useTemplateRef('contextMenu-ref')
const curSelectedItem = ref('null')
//#region Primevue
const panelMenu_dt = {
  itemPadding: '0.3rem 0.6rem',
}
const panelMenu_pt = {
  submenuIcon: {
    width: '13px',
    height: '13px',
    class: 'w-[13px] h-[13px]',
  },
}
const contextMenu_dt = {
  itemPadding: '0.3rem 0.6rem',
}
const contextMenu_pt = {
  root: {
    class: 'min-w-[9rem]',
  },
  itemLabel: 'leading-[16px]',
}
//#endregion
function addItem() {
  //items.value[3].items.push({ label: 'new_testcase' })
}
function selectedItem(e: any) {
  curSelectedItem.value = e.item.label
  console.log(e)
}
const callToggleContextMenu = (e: any) => {
  console.log(e)
  contextMenuItems.value = contextMenuItems3.value
  contextMenuRef.value?.show(e)
}
const callToggleContextMenu2 = (e: any) => {
  contextMenuItems.value = contextMenuItems2.value
  contextMenuRef.value?.show(e)
}
</script>
<template>
  <ContextMenu
    ref="contextMenu-ref"
    :model="contextMenuItems"
    class="text-xs1 leading-xs1"
    :pt="contextMenu_pt"
    :dt="contextMenu_dt"
  />
  <div class="leftpanel text-xs1 leading-xs1" @contextmenu="callToggleContextMenu">
    <PanelMenu :model="items" class="" multiple :pt="panelMenu_pt" :dt="panelMenu_dt">
      <template #item="{ item, active, hasSubmenu }">
        <span
          class="flex items-center px-2 py-2 cursor-pointer group gap-2 rounded-md"
          :class="{ 'bg-highlight-emphasis': curSelectedItem === item.label }"
          @contextmenu="callToggleContextMenu2"
        >
          <span
            v-show="hasSubmenu"
            :class="[{ 'pi pi-angle-down': active }, { 'pi pi-angle-right': !active }]"
          ></span>
          <span :class="[item.icon, 'group-hover:text-inherit']"></span>
          <span :class="['ml-2', { 'font-semibold': item.items }]">{{ item.label }}</span>
        </span>
      </template>
    </PanelMenu>
    <!-- w-full -->
  </div>
</template>
<style scoped>
.leftpanel {
  @apply h-full w-full p-1;
}
</style>
