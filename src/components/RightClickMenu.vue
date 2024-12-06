<script setup lang="ts">
import { nextTick, onActivated, onMounted, onUpdated, ref, useTemplateRef } from 'vue'
import ContextMenu from 'primevue/contextmenu'
import 'primeicons/primeicons.css'
import { useToast } from 'primevue'
import Toast from 'primevue/toast'

const props = defineProps({
  callFromContextMenu: { type: Function, required: true },
  onCommandExecute: { type: Function, required: true },
})
const contextMenuRef = useTemplateRef('contextMenu-ref')
const items = [
  {
    label: 'Nodes',
    icon: 'pi pi-ticket',
    items: [
      {
        label: 'Driver',
        command: (e: any) => {
          contextMenuValueChange(e)
        },
        nodeType: 'driver-node',
        cmdType: 'add-node',
      },
      {
        label: 'Variable',
        command: (e: any) => {
          contextMenuValueChange(e)
        },
        nodeType: 'var-node',
        cmdType: 'add-node',
      },
      {
        label: 'Element',
      },
      {
        label: 'Assert',
      },
      {
        label: 'Wait',
      },
    ],
  },
  {
    label: 'Utils',
    icon: 'pi pi-th-large',
    items: [
      {
        label: 'Comment Region',
      },
      {
        label: 'Ref Image',
      },
    ],
  },
  { separator: true },
  {
    label: 'Save',
    icon: 'pi pi-save',
    cmdType: 'data-exe',
    command: (e: any) => {
      contextMenuValueChange(e)
    },
  },
  {
    label: 'Run',
    icon: 'pi pi-play',
    cmdType: 'data-exe',
    command: (e: any) => {
      contextMenuValueChange(e)
    },
  },
  { separator: true },
  { label: 'Copy', icon: 'pi pi-copy' },
  { label: 'Paste', icon: 'pi pi-clipboard' },
  { label: 'Rename', icon: 'pi pi-file-edit' },
  { separator: true },
  { label: 'Delete', icon: 'pi pi-trash' },
]
const contextMenu_dt = {
  itemPadding: '0.3rem 0.6rem',
}
const contextMenu_pt = {
  root: {
    class: 'min-w-[9rem]',
  },
  itemLabel: 'leading-[16px]',
}
const toast = useToast()
function callFunction(e: any) {
  const data = {
    posX: e.clientX,
    posY: e.clientY,
    node: e,
  }
  props.callFromContextMenu(data)
}

function contextMenuValueChange(e: any) {
  console.log('context menu value changed')
  console.log(e)
  if (e.item.cmdType === 'add-node') {
    toast.add({
      severity: 'info',
      summary: 'Node Added',
      detail: 'Type: ' + e.item.nodeType,
      life: 3000,
    })
    const data = {
      posX: e.originalEvent.clientX,
      posY: e.originalEvent.clientY,
      node: e.item.nodeType,
    }
    props.callFromContextMenu(data)
  } else if (e.item.cmdType === 'data-exe') {
    if (e.item.label === 'Save') {
      toast.add({
        severity: 'warn',
        summary: 'Exec Command',
        detail: 'Type: Save',
        life: 3000,
      })
      const data = {
        cmd: e.item.label,
      }
      props.onCommandExecute(data)
    } else if (e.item.label === 'Run') {
      toast.add({
        severity: 'warn',
        summary: 'Exec Command',
        detail: 'Type: Run',
        life: 3000,
      })
      const data = {
        cmd: e.item.label,
      }
      props.onCommandExecute(data)
    }
  }
}
function liefCycleEnd() {
  console.log('end')
}
const callToggleContextMenu = (e: any) => {
  contextMenuRef.value?.show(e)
}
defineExpose({
  callToggleContextMenu,
})
</script>
<template>
  <!-- <div
    class="h-64 w-44 pt-1 bg-mbackground-900 shadow-inner shadow-mbackground-800 text-white font-roboto_mono font-light text-sm select-none"
  >
    <div
      class="h-fit w-full ps-4 py-1 hover:bg-mbackground-700"
      @click="callFunction('custom-test')"
    >
      Add Driver Node
    </div>
    <div class="h-fit w-full ps-4 py-1 hover:bg-mbackground-700" @click="callFunction('var-node')">
      Add Variable Node
    </div>
    <div class="h-fit w-full ps-4 py-1 hover:bg-mbackground-700">Add Assert Node</div>
    <div class="h-fit w-full ps-4 py-1 hover:bg-mbackground-700">Add Wait Node</div>
    <div class="h-fit w-full ps-4 py-1 hover:bg-mbackground-700">Add Note</div>
  </div> -->
  <Toast @life-end="liefCycleEnd" />
  <ContextMenu
    ref="contextMenu-ref"
    :model="items"
    class="text-xs1 leading-xs1"
    :pt="contextMenu_pt"
    :dt="contextMenu_dt"
  />
</template>
<style scoped></style>
