
import { getDirname, path } from 'vuepress/utils'

const __dirname = getDirname(import.meta.url)

// https://theme-hope.vuejs.press/zh/guide/advanced/replace.html#%E5%A6%82%E4%BD%95%E9%80%9A%E8%BF%87%E5%88%AB%E5%90%8D%E6%9B%BF%E6%8D%A2%E7%BB%84%E4%BB%B6

export default {
  "@theme-hope/modules/blog/components/BlogHero": path.resolve(
    __dirname,
    "./BlogHero.vue"),
  "@theme-hope/modules/blog/components/BloggerInfo": path.resolve(
    __dirname,
    "./BloggerInfo.vue",
  ),
  "@theme-hope/modules/blog/components/InfoPanel": path.resolve(__dirname, "./InfoPanel.vue"),
  // "@theme-hope/modules/navbar/components/NavbarLinks": path.resolve(__dirname,"./NavbarLinks.vue"),
  "@theme-hope/modules/blog/components/ArticleItem": path.resolve(__dirname, "./ArticleItem.vue"),
  "@theme-hope/modules/blog/components/Pagination": path.resolve(__dirname, "./Pagination.vue"),
  "@theme-hope/modules/blog/components/ArticleList": path.resolve(__dirname, "./ArticleList.vue"),
  //  "@theme-hope/modules/sidebar/components/Sidebar": path.resolve(__dirname,"./Sidebar.vue"),
  "@theme-hope/modules/info/components/CategoryInfo": path.resolve(__dirname, "./CategoryInfo.vue"),
  "@theme-hope/modules/blog/components/CategoryList": path.resolve(__dirname, "./CategoryList.vue")

}


