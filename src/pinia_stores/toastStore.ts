import { defineStore } from 'pinia'
import type { projectDataType } from '@/ts_types/puppet_test_types'
import type { ToastMessageOptions } from 'primevue'

export const useToastStore = defineStore('toastStore', {
  state: () => ({
    toastAddObject: <ToastMessageOptions>{
      severity: 'info',
      summary: 'No summary',
      detail: 'No details',
      life: 3000,
    },
    curMessage: 'No message',
  }),
  actions: {
    displayNewMessage(toastData: ToastMessageOptions) {
      this.toastAddObject = toastData
    },
  },
})
