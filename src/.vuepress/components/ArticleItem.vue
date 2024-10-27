<template>
  <article class="artice-item">
    <router-link class="artice-item-title" :to="path">
      <h3>
        {{ info.t }}
      </h3>
    </router-link>
    <div>
      <time class="artice-item-time">{{ pageInfo.localizedDate }}</time>
      <span class="artice-item-reading_time">{{ pageInfo.readingTimeLocale.words }}</span>
      <span class="artice-item-reading_time">{{ pageInfo.readingTimeLocale.time }}</span>

      <span class="artice-item-category" v-for="({name,path},i) in pageInfo.category" :key="i" @click="to(path)">#{{ name }}</span>
    </div>
    <p class="artice-item-summary">
      {{ postSummary }}
    </p>
    <!--  -->
  </article>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useNavigate } from "@theme-hope/composables/index";
import { useArticleInfo } from "@theme-hope/modules/blog/composables/index";



const props = defineProps({
  /**
   * Article information
   *
   * 文章信息
   */
  info: {
    type: Object,
    required: true,
  },

  /**
   * Article path
   *
   * 文章路径
   */
  path: { type: String, required: true },
})


const { info: pageInfo } = useArticleInfo(props);

const navigate = useNavigate();






function extractFirstPTagText(html: string): string | null {
  // 使用正则表达式匹配第一个<p>或<div>标签的文本内容
  const match = html?.match(/<(p|div)(?:[^>]*?)>(.*?)<\/\1>/s);
  let text = match ? match[2] : null;
  text = text?.replace(/<[^>]*>/g, '') || null

  // 如果找到了匹配项，则返回其文本内容，否则返回null
  return text
}

const postSummary = computed(() => {
  return extractFirstPTagText(props.info.e)
})

function to(path) {

  // let url = '/category/' + path.charAt(0).toLowerCase() + path.slice(1) + '/'
  navigate(path)
}
</script>
<style lang="scss" scoped>
.artice-item {
  margin: 1em auto 2em;
  // width: min(56rem, 90vw);
  line-height: 1.65;
  text-align: left;

  .artice-item-title {

    font-weight: 700;
    text-decoration: none;
    overflow-wrap: break-word;

    h3 {
      font-weight: 900;
      margin: 0;
    }

  }

  .artice-item-time {
    font-size: .8em;
    opacity: .5;
  }

  .artice-item-category {
    font-size: .8em;
    opacity: .5;
    margin-left: 1em;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .artice-item-reading_time {
    font-size: .8em;
    opacity: .5;
    margin-left: 1em;

  }

  .artice-item-summary {
    font-size: .9em;
    margin-top: 0;
    margin-bottom: 1em;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    opacity: 0.9;
  }
}
</style>
