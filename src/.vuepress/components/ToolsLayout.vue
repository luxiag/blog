<template>
  <BlogWrapper>
    <!--  -->
    <!-- <Content /> -->

    <main id="main-content" class="vp-project-home">
      <!--  -->
      <DropTransition>
        <FeaturePanel :features="features" />
      </DropTransition>
    </main>

  </BlogWrapper>
</template>
<script setup>
import BlogWrapper from "@theme-hope/modules/blog/components/BlogWrapper";
import { usePageFrontmatter } from "vuepress/client";
import { DropTransition } from "@theme-hope/components/transitions/index";
import FeaturePanel from "@theme-hope/components/FeaturePanel";
import { computed } from "vue";


const frontmatter = usePageFrontmatter();


const projects = computed(() => frontmatter.value.projects ?? []);
const features = computed(() => {
  const { features } = frontmatter.value;
  return Array.isArray(features) ? features : null;
});
</script>
