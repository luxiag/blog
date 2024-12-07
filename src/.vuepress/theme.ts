import { hopeTheme } from "vuepress-theme-hope";

import { enNavbar, zhNavbar } from "./navbar/index.js";
import { enSidebar, zhSidebar } from "./sidebar/index.js";
// import { docsearchPlugin } from '@vuepress/plugin-docsearch'


const NoBlogsArr = [
  "/tools/", "/games/"
]

export default hopeTheme(
  {
    hostname: "https://luxiag.github.io/luxiag",

    author: {
      name: "luxiag",
      url: "https://luxiag.github.io/luxiag",
    },

    iconAssets: "fontawesome-with-brands",

    logo: "./public/assets/images/logo.svg",

    repo: "luxiag/blog",

    docsDir: "src",

    blog: {
      name: 'luxiag',
      intro: 'https://github.com/luxiag',
      timeline: '',
      // sidebarDisplay:"none",
      articlePerPage: 20
      // medias: {
      //   Baidu: "https://example.com",
      //   BiliBili: "https://example.com",
      //   Bitbucket: "https://example.com",
      //   Dingding: "https://example.com",
      //   Discord: "https://example.com",
      //   Dribbble: "https://example.com",
      //   Email: "mailto:info@example.com",
      //   Evernote: "https://example.com",
      //   Facebook: "https://example.com",
      //   Flipboard: "https://example.com",
      //   Gitee: "https://example.com",
      //   GitHub: "https://example.com",
      //   Gitlab: "https://example.com",
      //   Gmail: "mailto:info@example.com",
      //   Instagram: "https://example.com",
      //   Lark: "https://example.com",
      //   Lines: "https://example.com",
      //   Linkedin: "https://example.com",
      //   Pinterest: "https://example.com",
      //   Pocket: "https://example.com",
      //   QQ: "https://example.com",
      //   Qzone: "https://example.com",
      //   Reddit: "https://example.com",
      //   Rss: "https://example.com",
      //   Steam: "https://example.com",
      //   Twitter: "https://example.com",
      //   Wechat: "https://example.com",
      //   Weibo: "https://example.com",
      //   Whatsapp: "https://example.com",
      //   Youtube: "https://example.com",
      //   Zhihu: "https://example.com",
      //   VuePressThemeHope: {
      //     icon: "https://theme-hope-assets.vuejs.press/logo.svg",
      //     link: "https://theme-hope.vuejs.press",
      //   },
      // },
    },

    locales: {
      "/": {
        // navbar
        navbar: enNavbar,

        // sidebar
        // sidebar: enSidebar,
        sidebar: false,

        footer: "Default footer",

        displayFooter: false,

        // This features is enabled for demo, only preserve if you need it
        comment: {
          provider: "Waline",
          serverURL: "https://blog-waline-flax-seven.vercel.app/", // your server url
          pageview: true,
          login: "force",
          wordLimit: 800
        },
        docsearch: {
          appId: "E61AH5LVMY",
          apiKey: "7ee7c421ead583565a0f595847080f06",
          indexName: "luxiagio",
        },
        // These features are enabled for demo, only preserve features you need here
        mdEnhance: {
          align: true,
          attrs: true,
          component: true,
          demo: true,
          include: true,
          mark: true,
          plantuml: true,
          spoiler: true,
          stylize: [
            {
              matcher: "Recommended",
              replacer: ({ tag }) => {
                if (tag === "em")
                  return {
                    tag: "Badge",
                    attrs: { type: "tip" },
                    content: "Recommended",
                  };
              },
            },

            metaLocales: {
              editLink: "Edit this page on GitHub",
            },
      },

        /**
         * Chinese locale config
         */
        "/zh/": {
          // navbar
          navbar: zhNavbar,

          // sidebar
          // sidebar: zhSidebar,
          sidebar: false,

          footer: "默认页脚",

          displayFooter: false,

          blog: {
            description: "一个前端开发者",
            intro: "/zh/intro.html",
          },

          // page meta
          metaLocales: {
            editLink: "在 GitHub 上编辑此页",
          },
        },
      },

      // encrypt: {
      //   config: {
      //     "/demo/encrypt.html": ["1234"],
      //     "/zh/demo/encrypt.html": ["1234"],
      //   },
      // },

      // enable it to preview all changes in time
      sidebar: false,
      hotReload: true,
      breadcrumb: false,
      breadcrumbIcon: false,
      prevLink: false,
      nextLink: false,
      titleIcon: false,
      // pageInfo:false,
      pageInfo: ["Date", 'Category', "ReadingTime", "PageView"],
      lastUpdated: false,
      contributors: false,
      editLink: false,
      copyright: false,
      plugins: {
        blog: {

          // timeline:'',
          excerptLength: 100,
          filter: (page) => {
            let isBlog = true
            if (page?.frontmatter?.home) isBlog = false
            if (page?.frontmatter?.onShow) isBlog = false
            NoBlogsArr.forEach((item) => {
              if (page.path.includes(item)) isBlog = false
            })
            if (!page?.frontmatter?.date) isBlog = false
            return isBlog
          }
        },
        shiki: {
          // 
          theme: "dracula"
          // themes: {
          //   light: "one-light",
          //   dark: "one-dark-pro",
          // },
        },
        // searchPro:true,

        // Install @waline/client before enabling it
        // Note: This is for testing ONLY!
        // You MUST generate and use your own comment service in production.
        // comment: {
        //   provider: "Waline",
        //   serverURL: "https://waline-comment.vuejs.press",
        // },

        components: {
          // components: ["Badge", "VPCard"],
        },

        // These features are enabled for demo, only preserve features you need here
        markdownImage: {
          figure: true,
          lazyload: true,
          size: true,
        },

        // markdownMath: {
        //   // install katex before enabling it
        //   type: "katex",
        //   // or install mathjax-full before enabling it
        //   type: "mathjax",
        // },

        // This features is enabled for demo, only preserve if you need it
        markdownTab: true,
        comment: {
          provider: "Waline",
          serverURL: "https://blog-waline-flax-seven.vercel.app/", // your server url
          pageview: true,
          login: "force",
          wordLimit: 200
        },
        docsearch: {
          appId: "E61AH5LVMY",
          apiKey: "7ee7c421ead583565a0f595847080f06",
          indexName: "luxiagio",
        },
        // These features are enabled for demo, only preserve features you need here
        mdEnhance: {
          align: true,
          attrs: true,
          component: true,
          demo: true,
          include: true,
          mark: true,
          plantuml: true,
          spoiler: true,
          stylize: [
            {
              matcher: "Recommended",
              replacer: ({ tag }) => {
                if (tag === "em")
                  return {
                    tag: "Badge",
                    attrs: { type: "tip" },
                    content: "Recommended",
                  };
              },
            },
          ],
          sub: true,
          sup: true,
          tasklist: true,
          vPre: true,

          // install chart.js before enabling it
          // chart: true,

          // insert component easily

          // install echarts before enabling it
          // echarts: true,

          // install flowchart.ts before enabling it
          flowchart: true,

          // gfm requires mathjax-full to provide tex support
          // gfm: true,

          // install mermaid before enabling it
          mermaid: true,

          // playground: {
          //   presets: ["ts", "vue"],
          // },

          // install @vue/repl before enabling it
          // vuePlayground: true,

          // install sandpack-vue3 before enabling it
          // sandpack: true,
        },

        // install @vuepress/plugin-pwa and uncomment these if you want a PWA
        // pwa: {
        //   favicon: "/favicon.ico",
        //   cacheHTML: true,
        //   cacheImage: true,
        //   appendBase: true,
        //   apple: {
        //     icon: "/assets/icon/apple-icon-152.png",
        //     statusBarColor: "black",
        //   },
        //   msTile: {
        //     image: "/assets/icon/ms-icon-144.png",
        //     color: "#ffffff",
        //   },
        //   manifest: {
        //     icons: [
        //       {
        //         src: "/assets/icon/chrome-mask-512.png",
        //         sizes: "512x512",
        //         purpose: "maskable",
        //         type: "image/png",
        //       },
        //       {
        //         src: "/assets/icon/chrome-mask-192.png",
        //         sizes: "192x192",
        //         purpose: "maskable",
        //         type: "image/png",
        //       },
        //       {
        //         src: "/assets/icon/chrome-512.png",
        //         sizes: "512x512",
        //         type: "image/png",
        //       },
        //       {
        //         src: "/assets/icon/chrome-192.png",
        //         sizes: "192x192",
        //         type: "image/png",
        //       },
        //     ],
        //     shortcuts: [
        //       {
        //         name: "Demo",
        //         short_name: "Demo",
        //         url: "/demo/",
        //         icons: [
        //           {
        //             src: "/assets/icon/guide-maskable.png",
        //             sizes: "192x192",
        //             purpose: "maskable",
        //             type: "image/png",
        //           },
        //         ],
        //       },
        //     ],
        //   },
        // },

        // install @vuepress/plugin-revealjs and uncomment these if you need slides
        // revealjs: {
        //   plugins: ["highlight", "math", "search", "notes", "zoom"],
        // },
      },
    }, {
  custom: true
});
