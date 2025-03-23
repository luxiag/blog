<template>
  <div class="playground-layout">
    <!--  -->
    <BlogWrapper>
      <!--  -->
      <Repl class="playground-layout__content" :editor="CodeMirror" />
    </BlogWrapper>
  </div>
</template>
<script setup>
import BlogWrapper from "@theme-hope/modules/blog/components/BlogWrapper";
import { Repl } from '@vue/repl'
import CodeMirror from '@vue/repl/codemirror-editor'

import { useDarkMode } from "@vuepress/helper/client";

const isDarkMode = useDarkMode();


</script>
<style lang="scss">

.playground-layout__content {
  padding-top: var(--navbar-height);
  height:  calc(100vh - var(--navbar-height));
}
</style>
