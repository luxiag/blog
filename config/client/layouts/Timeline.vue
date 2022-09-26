<template>
  <ParentLayout>
    <template #page>
      <main class="page">
        <div class="theme-default-content">
          <div class="content">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in timelines"
                :key="index"
                :timestamp="dayjs(activity.info.date).format('YYYY-MM-DD')"
              >
                <RouterLink :to="activity.path">
                  {{ activity.info.title }}
                </RouterLink>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <!-- <h1 class="timeline-title">Timeline</h1> -->
        <!-- <ArticleList :items="timelines.items" /> -->
      </main>
    </template>
  </ParentLayout>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useBlogType } from "vuepress-plugin-blog2/client";
import ArticleList from "../components/ArticleList.vue";
import ParentLayout from "@theme-default/layouts/Layout.vue";
import { ElTimeline } from "element-plus";
import dayjs from "dayjs";

const timelines = ref([]);

onMounted(() => {
  timelines.value = useBlogType("timeline").value.items.filter(
    (ite) => ite.info.page
  );
  console.log(timelines.value, "timelines");
});
</script>
<style></style>
