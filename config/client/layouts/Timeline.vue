<template>
  <ParentLayout>
    <template #page>
      <main class="page">
        <h1 class="timeline-title">Timeline</h1>
        <ArticleList :items="timelines.items" />
      </main>
    </template>
  </ParentLayout>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { useBlogType } from "vuepress-plugin-blog2/client";
import ArticleList from "../components/ArticleList.vue";
import ParentLayout from "@theme-default/layouts/Layout.vue";

const timelines = useBlogType('timeline')
onMounted(()=>{
    console.log(timelines,'timelines')
})
</script>