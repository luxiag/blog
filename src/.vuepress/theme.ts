import { hopeTheme } from "./vuepress-theme-hope/lib/node/index.js";
import { Navbar } from "./navbar/index.js";
// import { enSidebar, zhSidebar } from "./sidebar/index.js";
export default hopeTheme({
  hostname: "https://luxiag.github.io",
  fullscreen: true,
  author: {
    name: "luxiag",
    url: "https://luxiag.github.io",
  },

  iconAssets: "iconfont",

  logo: "/logo.svg",

  repo: "luxiag/luxiag.github.io",

  // docsDir: "docs",
  // 文章信息，可以填入数组，数组的顺序是各条目显示的顺序
  // pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],
  pageInfo: false,
  lastUpdated: false,
  blog: {
    // name:'luxiag',
    articleInfo: ["Date", "ReadingTime"],
    timeline: "",
  },
  // navbar
  navbar: Navbar,

  // sidebar
  // sidebar: "structure",
  sidebar: false,
  headerDepth: 4,
  // 默认的页脚文字
  footer: "页脚",
  editLink: false,
  contributors: false,
  displayFooter: false,
  copyright: false,
  breadcrumb: false,
  toc: true,
  themeColor: {
    blue: "#2196f3",
    red: "#f26d6d",
    green: "#3eaf7c",
    orange: "#fb9b5f",
    gray: "#bbb",
  },

  navbarLayout: {
    left: ["Brand"],
    center: [],
    right: ["Links", "Language", "Repo", "Outlook", "Search"],
  },
  // page meta
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
    toc: "目录",
  },

  encrypt: {
    // 加密配置，为一个对象，键名为匹配的路径，键值为对应的密码，接受字符串或字符串数组
    config: {
      "/demo/encrypt.html": ["1234"],
      "/zh/demo/encrypt.html": ["1234"],
    },
  },

  plugins: {
    blog: {
      autoExcerpt: true,
      filter: (page) =>
        Boolean(page.frontmatter?.title && page.frontmatter?.date),
    },
    // components:{
    //   backToTop: true,
    components: [
      "Badge",
      "BiliBili",
      "CodePen",
      "FontIcon",
      "PDF",
      "StackBlitz",
      "VideoPlayer",
      "YouTube",
    ],
    //   iconAssets: "iconfont",
    // },

    // If you don't need comment feature, you can remove following option
    // The following config is for demo ONLY, if you need comment feature, please generate and use your own config, see comment plugin documentation for details.
    // To avoid disturbing the theme developer and consuming his resources, please DO NOT use the following config directly in your production environment!!!!!
    // comment: {
    //   /**
    //    * Using Giscus
    //    */
    //   provider: "Giscus",
    //   repo: "vuepress-theme-hope/giscus-discussions",
    //   repoId: "R_kgDOG_Pt2A",
    //   category: "Announcements",
    //   categoryId: "DIC_kwDOG_Pt2M4COD69",

    //   /**
    //    * Using Twikoo
    //    */
    //   // provider: "Twikoo",
    //   // envId: "https://twikoo.ccknbc.vercel.app",

    //   /**
    //    * Using Waline
    //    */
    //   // provider: "Waline",
    //   // serverURL: "https://vuepress-theme-hope-comment.vercel.app",
    // },

    // Disable features you don't want here
    mdEnhance: {
      align: true,
      attrs: true,
      // chart: true,
      codetabs: true,
      container: true,
      demo: true,
      echarts: true,
      flowchart: true,
      gfm: true,
      imageSize: true,
      include: true,
      katex: true,
      lazyLoad: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ["ts", "vue"],
      },
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
      stylize: [
        {
          matcher: "Recommanded",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommanded",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vpre: true,
      vuePlayground: true,
    },

    pwa: {
      favicon: "/favicon.ico",
      cacheHTML: true,
      cachePic: true,
      appendBase: true,
      // apple: {
      //   icon: "/assets/icon/apple-icon-152.png",
      //   statusBarColor: "black",
      // },
      // msTile: {
      //   image: "/assets/icon/ms-icon-144.png",
      //   color: "#ffffff",
      // },
      // manifest: {
      //   icons: [
      //     {
      //       src: "/assets/icon/chrome-mask-512.png",
      //       sizes: "512x512",
      //       purpose: "maskable",
      //       type: "image/png",
      //     },
      //     {
      //       src: "/assets/icon/chrome-mask-192.png",
      //       sizes: "192x192",
      //       purpose: "maskable",
      //       type: "image/png",
      //     },
      //     {
      //       src: "/assets/icon/chrome-512.png",
      //       sizes: "512x512",
      //       type: "image/png",
      //     },
      //     {
      //       src: "/assets/icon/chrome-192.png",
      //       sizes: "192x192",
      //       type: "image/png",
      //     },
      //   ],
      //   shortcuts: [
      //     {
      //       name: "Demo",
      //       short_name: "Demo",
      //       url: "/demo/",
      //       icons: [
      //         {
      //           src: "/assets/icon/guide-maskable.png",
      //           sizes: "192x192",
      //           purpose: "maskable",
      //           type: "image/png",
      //         },
      //         {
      //           src: "/assets/icon/guide-monochrome.png",
      //           sizes: "192x192",
      //           purpose: "monochrome",
      //           type: "image/png",
      //         },
      //       ],
      //     },
      //   ],
      // },
    },
  },
});
