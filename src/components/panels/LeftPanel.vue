<script setup lang="ts">
import PanelMenu from 'primevue/panelmenu'
import { ref } from 'vue'

const items = ref([
  {
    label: 'Nodes',
    icon: 'pi pi-ticket',
    items: [
      {
        label: 'Node1',
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
    label: 'Files',
    icon: 'pi pi-file',
    items: [
      {
        label: 'file1',
      },
      {
        label: 'file2',
      },
      {
        label: 'file3',
      },
    ],
  },
])
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
</script>
<template>
  <div class="leftpanel text-xs1 leading-xs1">
    <PanelMenu :model="items" class="" multiple :pt="panelMenu_pt" :dt="panelMenu_dt" />
    <!-- w-full -->
  </div>
</template>
<style scoped>
.leftpanel {
  @apply h-full w-full p-1;
}
</style>
