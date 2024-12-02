<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import InputText from 'primevue/inputtext'
import { ref } from 'vue'

const inputRef = ref(null)
</script>
<template>
  <div class="text-xs">
    <p class="mt-2 mb-1">Store Variable</p>
    <InputText type="text" v-model="inputRef" class="text-xs py-[0.3rem] px-[0.4rem] w-full" />
  </div>
</template>
<style scope></style>
