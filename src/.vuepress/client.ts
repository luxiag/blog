import { defineClientConfig } from 'vuepress/client'
import { injectSpeedInsights } from '@vercel/speed-insights'

import MyComponent from './components/custom/MyComponent.vue'
import Tools from './components/ToolsLayout.vue'
import Playground from './components/PlaygroundLayout.vue'

export default defineClientConfig({
  // https://vuepress.vuejs.org/zh/advanced/cookbook/usage-of-client-config.html
  enhance: ({ app, router, siteData }) => {
    app.component('MyComponent', MyComponent)
  },
  setup() {
    // Initialize Vercel Speed Insights
    if (typeof window !== 'undefined') {
      injectSpeedInsights()
    }
  },
  layouts: {
    Tools, Playground
  }
})
