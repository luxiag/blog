import {ViteSSG} from 'vite-ssg'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat.js'
import NProgress from 'nprogress'
import {routes} from 'vue-router/auto-routes'

import App from './App.vue'



export const createApp = ViteSSG(App,{
  routes
},
({router,isClient}) => {
  dayjs.extend(LocalizedFormat)
  if (isClient) {
    router.beforeEach(() => {
      NProgress.start()
    })
    router.afterEach(() => {
      NProgress.done()
    })
  }
}
)
