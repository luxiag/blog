<template><div></div></template>


<script setup lang="ts">
    import {onMounted} from 'vue'
import { useBlogType } from "vuepress-plugin-blog2/client";
const articles = useBlogType("article");
onMounted(()=>{
  console.log(articles,'articles')
})
</script>