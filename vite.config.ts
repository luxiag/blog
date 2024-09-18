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

// @ts-expect-error missing types
import TOC from 'markdown-it-table-of-contents'
import sharp from 'sharp'
import { slugify } from './scripts/slugify'

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
      'vue-router',
      '@vueuse/core',
      'dayjs',
      'dayjs/plugin/localizedFormat',
    ],
  },
  plugins: [
    UnoCSS(),

    VueRouter({
      extensions: ['.vue', '.md'],
      routesFolder: 'pages',
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

    // AutoImport({
    //   imports: [
    //     'vue',
    //     VueRouterAutoImports,
    //     '@vueuse/core',
    //   ],
    // }),

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

    Inspect(),

    Icons({
      defaultClass: 'inline',
      defaultStyle: 'vertical-align: sub;',
    }),

    SVG({
      svgo: false,
      defaultImport: 'url',
    }),

    Exclude(),

    {
      name: 'await',
      async closeBundle() {
        await Promise.all(promises)
      },
    },
  ],



  ssgOptions: {
    formatting: 'minify',
  },
})


