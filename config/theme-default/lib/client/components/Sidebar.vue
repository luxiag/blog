<script setup lang="ts">
import { ref } from 'vue'
import NavbarItems from '@theme/NavbarItems.vue'
import SidebarItems from '@theme/SidebarItems.vue'

const showSidebar = ref(false)

const toggleSideBar = () => {
  showSidebar.value = !showSidebar.value
  document.body.classList.toggle('showSidebar', showSidebar.value)
  // if (showSidebar.value) {
  //   document.getElementsByTagName('body')[0].className += 'snow-container';
  //   document.body.style.paddingRight = 'var(--sidebar-width)'
  // } else {
  //   document.body.style.paddingRight = null
  // }
}


</script>

<template>
  <aside class="sidebar">
    <NavbarItems />
    <slot name="top" />
    <SidebarItems v-show="showSidebar" />
    <slot name="bottom" />

    <div @click="toggleSideBar" :class="['sidebar-toggle',showSidebar?'active':'']">
      <div class="sidebar-toggle-line-wrap"><span class="sidebar-toggle-line sidebar-toggle-line-first"></span> <span
          class="sidebar-toggle-line sidebar-toggle-line-middle"></span> <span
          class="sidebar-toggle-line sidebar-toggle-line-last"></span></div>
    </div>
  </aside>

</template>

