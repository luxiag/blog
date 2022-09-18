<template>

</template>
<script setup lang="ts">
import { onMounted } from "vue";
// import { RouterLink } from "vue-router";
import { useBlogCategory,useBlogType } from "vuepress-plugin-blog2/client";


const categoryMap = useBlogCategory("category");
const tagMap = useBlogCategory("tag");
const articles = useBlogType("article");

onMounted(()=>{
    console.log(categoryMap,tagMap,articles,'categoryMap')
})
</script>