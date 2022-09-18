<template>

</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { useBlogType } from "vuepress-plugin-blog2/client";

const timelines = useBlogType('timeline')
onMounted(()=>{
    console.log(timelines,'timelines')
})
</script>