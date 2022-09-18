import { defineUserConfig } from 'vuepress'
import { seoPlugin } from "vuepress-plugin-seo2";
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance";
import { photoSwipePlugin } from "vuepress-plugin-photo-swipe";
import { backToTopPlugin } from '@vuepress/plugin-back-to-top'
import { nprogressPlugin } from '@vuepress/plugin-nprogress'
import { blogPlugin } from "vuepress-plugin-blog2";
// import { commentPlugin } from "vuepress-plugin-comment2";

import theme from './theme'

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
    dest: '../dist',
    public: '../public',
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
          }),
    ]
})
