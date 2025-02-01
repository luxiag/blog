<template>
  <nav class="navbar-links">

  </nav>
</template>
<script setup lang="ts">
import { useNavbarItems } from "@theme-hope/modules/navbar/composables/index";

const navbarConfig = useNavbarItems();

console.log(navbarConfig.value,'navbarConfig')

</script>
