

import { defineClientConfig } from "@vuepress/client";

import Timeline from "./layouts/Timeline.vue";
import Category from './layouts/Category.vue'
import Article from './layouts/Article.vue'
export default defineClientConfig({
    // we provide some blog layouts
    layouts: {

        Timeline, Category, Article
    },
});