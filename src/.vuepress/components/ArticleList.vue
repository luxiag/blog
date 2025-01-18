<template>
  <section id="article-list" class="vp-article-list" role="feed">
    <ArticleItem v-for="({ info, path }, index) in currentArticles" :key="path" :info="info" :path="path" />
    <div class="article-list-pagination" @click="handleAddArticles" v-if="currentArticles.length < pageModel.totalSize">
      . . . . . . . . . /
    </div>
  </section>
  <div class="article-list-blocks">
    <div class="article-list-block " v-for="ite in pageModel.blockList" :key="ite.id"
      :style="{ top: ite.top + 'px', left: ite.left + 'px' }"></div>
  </div>
</template>
<script setup>
import { reactive, computed, watch, onMounted, nextTick } from 'vue';
import { useBlogOptions } from "@theme-hope/modules/blog/composables/index";

import ArticleItem from './ArticleItem.vue';

const blogOptions = useBlogOptions();


const props = defineProps({
  /**
  * Articles
  *
  * 文章项目
  */
  items: {
    type: Array,
    default: () => [],
  },
})

const pageModel = reactive({
  currentPage: 1,
  pageSize: blogOptions.value.articlePerPage ?? 20,
  totalSize: props.items.length,
  blockList: [],
  isRefresh: false
})

const currentArticles = computed(() => {
  return props.items.slice(0, pageModel.pageSize * pageModel.currentPage) || []
})

const handleAddArticles = () => {
  if (currentArticles.value.length < pageModel.totalSize) {
    pageModel.currentPage++
    console.log('handleAddArticles', pageModel.currentPage)
  }
}

const getRandom = (num, max) => {
  let newNum = Math.random() * max
  const gap = max / 8
  if (Math.abs(newNum - num) < gap || newNum < gap || newNum > (max - gap)) {
    newNum = getRandom(num, max)
  }
  return newNum
}

const makeBlock = () => {

  if (!__VUEPRESS_SSR__) {
    nextTick(() => {
      const arr = pageModel.blockList
      const maxTop = document.getElementById('article-list')?.clientHeight
      if (currentArticles.value.length !== pageModel.blockList.length) {
        const len = currentArticles.value.length - pageModel.blockList.length
        const index = pageModel.blockList.length
        for (let i = 1; i <= len; i++) {
          const top = (index + i) * 140
          let newLeft = Math.random() * document.body.clientWidth
          const oldLeft = arr[arr.length - 1]?.left
          if (oldLeft) {
            newLeft = getRandom(oldLeft, document.body.clientWidth)
          }
          if (!maxTop || top < maxTop) {
            arr.push({
              id: index + i,
              top,
              left: newLeft,
            })
          }


        }
        pageModel.blockList = arr
      }
    })
  }

}

watch(currentArticles, () => {
  makeBlock()
}, {
  immediate: true
})
watch(() => pageModel.isRefresh, () => {
  pageModel.blockList = []
  makeBlock()
})

onMounted(() => {
  let timer
  window.addEventListener('resize', () => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      pageModel.isRefresh = !pageModel.isRefresh
    }, 500)

  })
})

</script>
<style lang="scss" scoped>
.article-list-pagination {
  font-size: .8em;
  opacity: .5;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.vp-article-list {
  position: relative;
  background-color: transparent;
  z-index: 1;
}

.article-list-blocks {

  .article-list-block {
    position: absolute;
    background-color: var(--black-bg-color);
    width: clamp(70px, 10vw, 140px);
    aspect-ratio: 4/3;
    border-radius: .25em;
    // z-index: -10;

  }

  [data-theme="dark"] & {
    .article-list-block {
      background-color: transparent;
    }
  }
}
</style>
