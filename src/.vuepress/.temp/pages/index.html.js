export const data = JSON.parse("{\"key\":\"v-8daa1a0e\",\"path\":\"/\",\"title\":\"测试1\",\"lang\":\"zh-CN\",\"frontmatter\":{\"sidebarDepth\":5},\"excerpt\":\"\",\"headers\":[{\"level\":2,\"title\":\"2\",\"slug\":\"_2\",\"link\":\"#_2\",\"children\":[{\"level\":3,\"title\":\"3\",\"slug\":\"_3\",\"link\":\"#_3\",\"children\":[]}]}],\"git\":{\"updatedTime\":1663417598000,\"contributors\":[{\"name\":\"luxiang\",\"email\":\"luxiag@qq.com\",\"commits\":1}]},\"filePathRelative\":\"index.md\"}")

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
