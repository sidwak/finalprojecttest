<script setup lang="ts">
import { InputText, Button } from 'primevue'
import { ref, defineProps, defineExpose } from 'vue'
import Dialog from 'primevue/dialog';

const dialog_pt = {}
const dialog_dt = {
  header: {
    padding: '0.75rem 0.75rem 0rem 0.75rem',
  },
  content: {
    padding: '0.75rem 0.75rem',
  },
}

const isVisible = ref(false)

const toggleModalVisibility = (e: any) => {
  isVisible.value = !isVisible.value
}

defineExpose({
  toggleModalVisibility,
})
</script>
<template>
  <Dialog v-model:visible="isVisible" modal header="Edit Profile" :style="{ width: '25rem' }" :pt="dialog_pt" :dt="dialog_dt">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your information.</span>
    <div class="flex items-center gap-4 mb-4">
        <label for="username" class="font-semibold w-24">Username</label>
        <InputText id="username" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex items-center gap-4 mb-8">
        <label for="email" class="font-semibold w-24">Email</label>
        <InputText id="email" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex justify-end gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="isVisible = false"></Button>
        <Button type="button" label="Save" @click="isVisible = false"></Button>
    </div>
</Dialog>
</template>
<style scoped></style>