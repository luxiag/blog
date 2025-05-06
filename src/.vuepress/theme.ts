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
    favicon: "/favicon.ico",
    author: {
      name: "luxiag",
      url: "https://luxiag.github.io/luxiag",
    },


    logo: "./public/favicon.svg",

    repo: "luxiag/blog",

    docsDir: "src",

    blog: {
      name: 'luxiag',
      intro: 'https://github.com/luxiag',
      timeline: '',
      // sidebarDisplay:"none",
      articlePerPage: 20
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

        blog: {
          description: "A FrontEnd programmer",

          intro: "/intro.html",
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
    // These features are enabled for demo, only preserve features you need here
    markdown: {
      tasklist: true,
      // 启用 figure
      figure: true,
      // 启用图片懒加载
      imgLazyload: true,
      // 启用图片标记
      imgMark: true,
      // 启用图片大小
      imgSize: true,

      math: {
        type: "mathjax", // 或 'katex 'mathjax'
      },
      include: true,
      revealjs: true,
      footnote: true,
      tabs: true,
      hint: true,
      alert: true,
      // 启用下角标
      sub: true,
      // 启用上角标
      sup: true,
      spoiler: true,
      attrs: true,
      mark: true,
      align: true,
      chartjs: true,
      echarts: true,
      mermaid: true,
      markmap: true,
      flowchart: true,
      highlighter: {
        type: "shiki", // or "prismjs"
        theme: "dracula"
      },
      codeTabs: true,
      vuePlayground: true
    },
    plugins: {
      icon: {
        assets: 'fontawesome-with-brands'
      },
      blog: {
        excerptLength: 100,
        filter: (page) => {
          let isBlog = true
          if (page?.frontmatter?.home) isBlog = false
          if (page?.frontmatter?.noShow) isBlog = false
          NoBlogsArr.forEach((item) => {
            if (page.path.includes(item)) isBlog = false
          })
          if (!page?.frontmatter?.date) isBlog = false
          return isBlog
        }
      },

      components: {
        // components: ["Badge", "VPCard"],
      },
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




    },
  }, {
  custom: true
});
