import { defineUserConfig } from "@vuepress/cli";
import theme from "./theme.js";
// import customComponent from './components/index.js'
// import { webpackBundler } from "@vuepress/bundler-webpack";
// import { componentsPlugin } from "vuepress-plugin-components";
export default defineUserConfig({
  base: "/blog/",
  dest: "./dist",
  lang: "zh-CN",
  // title: "luxiag's Blog",

  theme,

  shouldPrefetch: false,
  // plugins:[
  
  // ]
  // bundler: webpackBundler({
  //   postcss: {},
  //   vue: {},
  // }),
});
