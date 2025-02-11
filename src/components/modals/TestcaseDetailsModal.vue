<script setup lang="ts">
import { Panel, useVueFlow } from '@vue-flow/core'
import { Divider, InputText } from 'primevue'
import { ref, computed, watch } from 'vue'

//const props = defineProps(['curTestcaseData'])

const testcaseIdRef = ref('no_testcase_id')
const testcaseNameRef = ref('no_testcase_name')
const testcaseDescRef = ref('no_testcase_desc')

//#region Primevue
const divider_dt = {
  colorScheme: {
    light: {
      root: {
        borderColor: '{zinc.600}',
      },
    },
    dark: {
      root: {
        borderColor: '{zinc.500}',
      },
    },
  },
}
const divider_pt = {
  root: {
    class: 'my-3',
  },
}
//#endregion

//
</script>
<template>
  <Panel position="top-right">
    <div class="propertiesMenu">
      <div class="propertiesMenu-heading">Properties</div>
      <Divider :pt="divider_pt" :dt="divider_dt" />
      <div class="propertiesMenu-content">
        <div class="flex gap-2 items-center justify-between">
          Testcase Id:
          <InputText disabled :placeholder="testcaseIdRef" size="small" />
        </div>
        <div class="flex gap-2 items-center justify-between">
          Testcase Name:
          <InputText type="text" v-model="testcaseNameRef" class="" size="small" />
        </div>
        <div class="flex gap-2 items-center justify-between" ">
          Testcase Description:
          <InputText
            type="text"
            v-model="testcaseDescRef"
            class=""
            size="small"
          />
        </div>
      </div>
    </div>
  </Panel>
</template>
<style scoped></style>
