<script setup lang="ts">
import { nextTick, onActivated, onMounted, onUpdated, ref, useTemplateRef } from 'vue'
import ContextMenu from 'primevue/contextmenu'
import 'primeicons/primeicons.css'
import { useToast } from 'primevue'
import Toast from 'primevue/toast'

const toast = useToast()

//#region Props
const props = defineProps({
  callFromContextMenu: { type: Function, required: true },
  onCommandExecute: { type: Function, required: true },
})
//#endregion
//#region Refs
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
        label: 'Element (DOM)',
        command: (e: any) => {
          contextMenuValueChange(e)
        },
        nodeType: 'dom-node',
        cmdType: 'add-node',
      },
      {
        label: 'Assert',
        command: (e: any) => {
          contextMenuValueChange(e)
        },
        nodeType: 'asr-node',
        cmdType: 'add-node',
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
    label: 'Load',
    icon: 'pi pi-file',
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
//#endregion
//#region Primevue
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

function contextMenuValueChange(e: any) {
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
    } else if (e.item.label === 'Load') {
      toast.add({
        severity: 'warn',
        summary: 'Exec Command',
        detail: 'Type: Load',
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
