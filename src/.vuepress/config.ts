import { defineUserConfig } from "vuepress";
import { viteBundler } from '@vuepress/bundler-vite'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

import theme from "./theme.js";

import alias from './components/index.js'




export default defineUserConfig({
  base: "/blog/",

  locales: {
    "/": {
      lang: "en-US",
      // title: "Blog Demo",
      // description: "A blog demo for vuepress-theme-hope",
    },
    // "/zh/": {
    //   lang: "zh-CN",
    //   title: "博客演示",
    //   description: "vuepress-theme-hope 的博客演示",
    // },
  },

  theme,
  alias,
  bundler: viteBundler({
       viteOptions: {
         css: {
          postcss: {
            plugins: [
              autoprefixer(),
              tailwindcss()
            ]
          }
         }
       }
  }),
  head:[
    ["link",{
      rel: "preconnect",
      href: "https://rsms.me/"

    }],
    ['link',{
      rel:"stylesheet",
      href: "https://rsms.me/inter/inter.css"
    }]
  ]

  // Enable it with pwa
  // shouldPrefetch: false,
});
