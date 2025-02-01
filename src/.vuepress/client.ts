import { defineClientConfig } from 'vuepress/client'

import MyComponent from './components/custom/MyComponent.vue'
import Tools from './layout/tools.vue'

export default defineClientConfig({
  // https://vuepress.vuejs.org/zh/advanced/cookbook/usage-of-client-config.html
  enhance: ({ app, router, siteData }) => {
    app.component('MyComponent', MyComponent)
  },
  layouts: {
    Tools
  }
})
