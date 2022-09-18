import { defineUserConfig } from 'vuepress'
import { getDirname, path } from '@vuepress/utils'

import { seoPlugin } from "vuepress-plugin-seo2";
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance";
import { photoSwipePlugin } from "vuepress-plugin-photo-swipe";
import { backToTopPlugin } from '@vuepress/plugin-back-to-top'
import { nprogressPlugin } from '@vuepress/plugin-nprogress'
import { blogPlugin } from "vuepress-plugin-blog2";

// import { commentPlugin } from "vuepress-plugin-comment2";

import theme from './theme'

const __dirname = getDirname(import.meta.url)
export default defineUserConfig({
    lang: 'zh-CN',
    title: '',
    description: '',
    theme,
    markdown: {
        headers: {
            level: [2, 3, 4, 5]
        }
    },
    repo: "luxiag.github.io",

    dest: '../dist',
    public: '../public',
    clientConfigFile: path.resolve(
        __dirname,
        './client/index.ts'
    ),
    plugins: [
        seoPlugin({
            hostname: 'luxiag.github.io',
            author: 'luxiag'
        }),
        mdEnhancePlugin({

            // 启用流程图
            flowchart: true,
            // 启用 mermaid
            mermaid: true,
            // 启用 TeX 支持
            tex: true,
            // 启用任务列表
            tasklist: true,
            // 启用下角标功能
            sub: true,
            // 启用上角标
            sup: true,
            // 启用自定义对齐
            align: true,
            // 启用属性支持
            attrs: true,
            // 启用图片标记
            imageMark: true,
            // 启用图片大小
            imageSize: true,
            // 启用导入支持
            include: true,
        }),
        // commentPlugin({
        //     // 插件选项

        //   }),
        photoSwipePlugin({
            // your options
        }),
        backToTopPlugin(),
        nprogressPlugin(),
        blogPlugin({
            //插件选项
            getInfo: ({ frontmatter, title }) => ({
                title,
                author: frontmatter.author || "",
                date: frontmatter.date || null,
                category: frontmatter.category || [],
                tag: frontmatter.tag || [],
            }),
            category: [
                {
                    key: "category",
                    getter: (page) => <string[]>page.frontmatter.category || [],
                    layout: "Category",
                    itemLayout: "Category",
                    frontmatter: () => ({ title: "Categories", sidebar: false }),
                    itemFrontmatter: (name) => ({
                        title: `Category ${name}`,
                        sidebar: false,
                    }),
                },
            ],
            type: [
                {
                    key: "article",
                    // remove archive articles
                    filter: (page) => !page.frontmatter.archive,
                    path: "/article",
                    layout: "Article",
                    frontmatter: () => ({ title: "Articles", sidebar: false }),
                    // sort pages with time and sticky
                    sorter: (pageA, pageB) => {
                      if (pageA.frontmatter.sticky && pageB.frontmatter.sticky)
                        return (
                          (pageB.frontmatter.sticky as number) -
                          (pageA.frontmatter.sticky as number)
                        );
          
                      if (pageA.frontmatter.sticky && !pageB.frontmatter.sticky)
                        return -1;
          
                      if (!pageA.frontmatter.sticky && pageB.frontmatter.sticky) return 1;
          
                      if (!pageB.frontmatter.date) return 1;
                      if (!pageA.frontmatter.date) return -1;
          
                      return (
                        new Date(pageB.frontmatter.date).getTime() -
                        new Date(pageA.frontmatter.date).getTime()
                      );
                    },
                  },
                {
                    key: "timeline",
                    // only article with date should be added to timeline
                    filter: (page) => page.frontmatter.date instanceof Date,
                    // sort pages with time
                    sorter: (pageA, pageB) =>
                        new Date(pageB.frontmatter.date as Date).getTime() -
                        new Date(pageA.frontmatter.date as Date).getTime(),
                    path: "/timeline/",
                    layout: "Timeline",
                    frontmatter: () => ({ title: "Timeline", sidebar: false }),
                },
            ],
            hotReload: true
        }),
    ]
})
