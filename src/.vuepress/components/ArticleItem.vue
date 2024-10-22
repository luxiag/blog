<template>
  <article class="artice-item">
    <router-link class="artice-item-title" :to="path">
      <h3>
        {{ info.t }}
      </h3>
    </router-link>
    <div>
      <time class="artice-item-time">{{ dateWriting }}</time>
      <span class="artice-item-reading_time">{{ readingTimeMeta }}</span>
      <span class="artice-item-category" v-for="(c,i) in info.c" :key="i" @click="to(c)">#{{ c }}</span>
    </div>
    <p class="artice-item-summary">
      {{ postSummary }}
    </p>
    <!--  -->
  </article>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useMetaLocale } from "@theme-hope/modules/info/composables/index";
import { useNavigate } from "@theme-hope/composables/index";



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

const navigate = useNavigate();

const metaLocale = useMetaLocale();
const readingTimeMeta = computed(() => {
  if (!props.info.r) {
    return null;
  }
  const { minutes } = props.info.r;
  return minutes < 1 ? "less than 1 min read" : `${Math.round(minutes)} min read`;
});


console.log(props,'props')


function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要+1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}年${month}月${day}日`;
}

const dateWriting = computed(() => {
  // const date = new Date(props.info.d);
  // return formatDate(date)
  return props.info.l
})

function extractFirstPTagText(html: string): string | null {
  // 使用正则表达式匹配第一个<p>或<div>标签的文本内容
    const match = html?.match(/<(p|div)(?:[^>]*?)>(.*?)<\/\1>/s);

// 如果找到了匹配项，则返回其文本内容，否则返回null
return match ? match[2] : null;
}

const postSummary = computed(()=>{
return  extractFirstPTagText(props.info.e)
})

function to  (path)  {
  if(!path) return
  let url = '/category/' + path.charAt(0).toLowerCase() + path.slice(1) + '/'
  navigate(url)
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
