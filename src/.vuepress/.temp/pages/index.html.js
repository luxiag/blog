export const data = JSON.parse("{\"key\":\"v-8daa1a0e\",\"path\":\"/\",\"title\":\"\",\"lang\":\"zh-CN\",\"frontmatter\":{\"sidebar\":false,\"summary\":\"import {onMounted} from 'vue' import { useBlogType } from \\\"vuepress-plugin-blog2/client\\\"; const articles = useBlogType(\\\"article\\\"); onMounted(()=>{ console.log(articles,'articles') \",\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://luxiag.github.io/\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}],[\"meta\",{\"property\":\"article:author\",\"content\":\"luxiag\"}]]},\"excerpt\":\"\",\"headers\":[],\"git\":{},\"filePathRelative\":\"index.md\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
