<template>
  <ParentLayout>
    <template #page>
      <main class="page">
        <!-- <ArticleList :items="articles.items" /> -->
        <div class="theme-default-content">
          <div class="content">
            <ul>
              <div class="posts-list" v-for="list in posts" :key="list.year">
                <div class="post-date">
                  <span>{{ list.year }}</span>
                </div>
                <article v-for="{ info, path } in list.posts" :key="path" class="post-nav">
                  <header class="title">
                    <RouterLink :to="path">
                      {{ info?.title }}
                    </RouterLink>
                  </header>
                  <p v-if="info?.date" class="date">
                    {{dayjs(info.date).format('YYYY-MM-DD') }}
                  </p>
                </article>
              </div>
            </ul>
          </div>
        </div>
      </main>
    </template>
  </ParentLayout>
</template>
<script setup lang="ts">
// import ArticleList from "../components/ArticleList.vue";
import ParentLayout from "@theme-default/layouts/Layout.vue";
import { onMounted, ref } from "vue";
import { useBlogType } from "vuepress-plugin-blog2/client";
import dayjs from "dayjs";

const articles = useBlogType("article");
const posts = ref([]);
const addPosts = () => {
  // posts.value = posts.value.concat(articles)
};

onMounted(() => {
  let tempPosts = articles.value?.items?.filter(
    (post) => post.info.title && post.info.page
  );
  let yearPosts = { year: null, posts: [] };
  tempPosts.forEach((ite) => {
    let year = String(ite.info.date).slice(0, 4);
    if (String(year) === String(yearPosts.year)) {
      // console.log(yearPosts.posts, "yearPost.posts");
      yearPosts.posts.push(ite);
    } else {
      posts.value.push(yearPosts);
      yearPosts.year = year;
      yearPosts.posts = [ite];
    }
  });
  console.log(posts.value, "posts");
});
</script>
<style lang="scss" scoped>
  .post-date {
    height: 5rem;
    position: relative;
    z-index: -2;
    >span {
      opacity: 0.1;
      position: absolute;
      font-size: 8em;
      top: -2rem;
      left: -1rem;
    }
  }
  .post-nav {
    opacity: 0.6;
    margin: 1.2rem;

    a:hover {
      text-decoration: none;

      // opacity: 1;
    }
    .title {
      font-size: 1.125rem;;
      a {
        color: #000;

      }
    }
    .date {
      color: var(--c-text-accent);
      margin: 0;
      font-size: 0.875rem;
    }
  }
  .post-nav:hover {
    opacity: .8;
  }
</style>
