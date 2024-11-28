<script setup lang="ts">
import { ref, type Ref } from 'vue'
const isVisible = ref(true)
const isWaitingForClose = ref(false)
function changeVisibility() {
  if (isVisible.value === true) {
    isWaitingForClose.value = true
    setTimeout(() => {
      isVisible.value = !isVisible.value
      isWaitingForClose.value = false
    }, 240)
  } else {
    isVisible.value = !isVisible.value
  }
}
</script>
<template>
  <div class="text-white select-none">
    <div class="flex hover:bg-mbackground-600 items-center ps-2" @click="changeVisibility">
      <img src="../assets/arrow_down.png" width="24px" height="24px" />
      <p class="">Nodes</p>
    </div>
    <ul
      class="block"
      :class="{
        hidden: !isVisible,
        'dropdown_menu-1': !isWaitingForClose,
        'reverse-animation': isWaitingForClose,
      }"
    >
      <li class="dropdown_item-1">
        <div class="flex hover:bg-mbackground-600 items-center ps-6">
          <img src="../assets/arrow_right.png" width="24px" height="24px" />
          <p>node1compo</p>
        </div>
      </li>
      <li class="dropdown_item-2">
        <div class="flex hover:bg-mbackground-600 items-center ps-6">
          <img src="../assets/arrow_right.png" width="24px" height="24px" />
          <p>node2compo</p>
        </div>
      </li>
      <li class="dropdown_item-3">
        <div class="flex hover:bg-mbackground-600 items-center ps-6">
          <img src="../assets/arrow_right.png" width="24px" height="24px" />
          <p>node3compo</p>
        </div>
      </li>
      <li class="dropdown_item-4">
        <div class="flex hover:bg-mbackground-600 items-center ps-6">
          <img src="../assets/arrow_right.png" width="24px" height="24px" />
          <p>node4compo</p>
        </div>
      </li>
      <li class="dropdown_item-5">
        <div class="flex hover:bg-mbackground-600 items-center ps-6">
          <img src="../assets/arrow_right.png" width="24px" height="24px" />
          <p>node5compo</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<style scoped lang="scss">
.pc1 {
  max-height: 0;
  transition: max-height 0.45s ease-out;
  overflow: hidden;
}

.pc1.is-show {
  max-height: 500px;
  transition: max-height 0.45s ease-in;
}

.dropdown_menu-1 {
  @for $num from 1 through 5 {
    .dropdown_item-#{$num} {
      transform-origin: top center;
      opacity: 0;
      height: 0;
      animation: scaleZ 100ms #{$num * 60}ms ease-in-out forwards;
    }
  }
}
.reverse-animation {
  @for $num from 1 through 5 {
    .dropdown_item-#{$num} {
      animation: scaleZReverse 100ms #{(5 - $num) * 60}ms ease-in-out forwards;
    }
  }
}
@keyframes scaleZ {
  0% {
    opacity: 0;
    //transform: scale(0);
    height: 0;
  }

  80% {
    //transform: scale(1.07);
  }

  100% {
    opacity: 1;
    //transform: scale(1);
    height: auto;
  }
}
@keyframes scaleZReverse {
  0% {
    opacity: 1;
    height: auto;
    //transform: scale(1);
  }

  20% {
    //transform: scale(1.07);
  }

  100% {
    opacity: 0;
    height: 0;
    //transform: scale(0);
  }
}
</style>
