import { defineClientConfig } from "@vuepress/client";

import Timeline from "./layouts/Timeline.vue";
import Category from "./layouts/Category.vue";
import Article from "./layouts/Article.vue";

import { ElTimeline } from "element-plus";
import 'element-plus/dist/index.css'
export default defineClientConfig({
  enhance({ app }) {
    app.use(ElTimeline);
  },
  // we provide some blog layouts
  layouts: {
    Timeline,
    Category,
    Article,
  },
});
