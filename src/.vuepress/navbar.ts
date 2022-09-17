import { navbar } from "vuepress-theme-hope";

export default navbar([


  { text: "博客",  link: "/posts/",activeMatch:'^/posts/' },
  { text: "分类",  link: "/guide/" },
]);
