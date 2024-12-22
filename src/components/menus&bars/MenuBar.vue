<script setup lang="ts">
import Menubar from 'primevue/menubar'
import { ref } from 'vue'
const items = ref([
  {
    label: 'File',
    items: [
      {
        label: 'Open',
      },
      {
        label: 'New',
      },
      {
        label: 'Close',
      },
    ],
  },
  {
    label: 'Edit',
  },
  {
    label: 'Project',
  },
  {
    label: 'Action',
  },
  {
    label: 'Debug',
  },
  {
    label: 'Window',
  },
])
const menuBarDt = {
  baseItemPadding: '0.25rem 0.5rem',
  //submenuIconSize: '0rem',
  root: {
    padding: '0rem 0.75rem',
    gap: '0rem',
    borderRadius: '0px',
  },
  item: {
    padding: '0.25rem 0.5rem',
  },
}
const propsTokens = {
  root: {
    class: 'border-0',
  },
  submenuIcon: {
    id: 'hello',
    width: '0px',
    height: '0px',
    class: 'w-0 h-0',
  },
  submenu: {
    class: 'min-w-[8rem]',
  },
}
</script>
<template>
  <!-- <div class="hover:bg-mbackground-600 px-2"><p>File</p></div>
  <div class="hover:bg-mbackground-600 px-2"><p>Edit</p></div>
  <div class="hover:bg-mbackground-600 px-2"><p>Project</p></div>
  <div class="hover:bg-mbackground-600 px-2"><p>Action</p></div>
  <div class="hover:bg-mbackground-600 px-2"><p>Debug</p></div>
  <div class="hover:bg-mbackground-600 px-2"><p>Window</p></div> -->
  <div class="text-xs1 leading-xs1">
    <Menubar :model="items" :pt="propsTokens" :dt="menuBarDt">
      <template #submenuicon></template>
    </Menubar>
  </div>
</template>
<style scoped></style>
