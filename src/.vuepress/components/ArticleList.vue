<template>
  <section id="article-list" class="vp-article-list" role="feed">
    <ArticleItem v-for="({info,path},index) in currentArticles" :key="path" :info="info" :path="path" />
    <div class="article-list-pagination" @click="handleAddArticles" v-if="currentArticles.length <  currentPage.totalSize">
      . . . . /
    </div>
  </section>
</template>
<script setup>
import { reactive,computed } from 'vue';
import ArticleItem from './ArticleItem.vue';


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

const currentPage = reactive({
  currentPage:1,
  pageSize:20,
  totalSize:props.items.length
})

const currentArticles = computed(()=>{
  return props.items.slice(0,currentPage.pageSize*currentPage.currentPage) || []
})

const handleAddArticles = () => {
  if(currentArticles.length <  currentPage.totalSize) {
    currentPage.currentPage++
  }
  console.log(currentPage.currentPage++)
}
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
</style>
