import { basename, dirname, resolve } from 'node:path'
import { Buffer } from 'node:buffer'
import { defineConfig } from 'vite'
import fs from 'fs-extra'
import Inspect from 'vite-plugin-inspect'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import Vue from '@vitejs/plugin-vue'
import matter from 'gray-matter'
import AutoImport from 'unplugin-auto-import/vite'
import anchor from 'markdown-it-anchor'
import LinkAttributes from 'markdown-it-link-attributes'
import GitHubAlerts from 'markdown-it-github-alerts'
import UnoCSS from 'unocss/vite'
import SVG from 'vite-svg-loader'
import MarkdownItShiki from '@shikijs/markdown-it'
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash'
// import MarkdownItMagicLink from 'markdown-it-magic-link'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import Exclude from 'vite-plugin-optimize-exclude'


const promises: Promise<unknown>[] = []

export default defineConfig({
  resolve: {
    alias: [
      { find: '~/', replacement: `${resolve(__dirname, 'src')}/` },
    ],
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router', 'dayjs',
    ],
  },
  plugins: [
    UnoCSS(),

    VueRouter({
      extensions: ['.vue', '.md'],
      routesFolder: 'src/pages',
      logs: true,
      extendRoute(route) {
        const path = route.components.get('default')
        if (!path)
          return
      },
    }),

    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    // https://github.com/unplugin/unplugin-vue-markdown
    /*
    Compile Markdown to Vue component.
    */
    Markdown({
        async markdownItSetup(md) {
          console.log(md,'md')

        }
    }),
    AutoImport({
      imports: [
        'vue'
      ],
      dts: 'types/auto-imports.d.ts',
    }),
    // 组件自动引入
    Components({
      extensions: ['vue', 'md'],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver({
          componentPrefix: '',
        }),
      ],
    }),
    // 检查 Vite 插件的中间状态。 安装后，你可以访问 localhost:5173/__inspect/ 来检查你项目的模块和栈信息。
    Inspect(),

    Icons({
      defaultClass: 'inline',
      defaultStyle: 'vertical-align: sub;',
    }),
    // https://www.npmjs.com/package/vite-svg-loader
    SVG({
      svgo: false,
      defaultImport: 'url',
    }),
    // Exclude ESM dependencies from Vite optimization. To reduce the chance of "New dependencies detected" page reloads.
    Exclude(),


  ],

})


