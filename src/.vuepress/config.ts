import { defineUserConfig } from "@vuepress/cli";
import theme from "./theme.js";
// import { webpackBundler } from "@vuepress/bundler-webpack";
// import { componentsPlugin } from "vuepress-plugin-components";

export default defineUserConfig({
  base: "/",
  dest: "./dist",
  lang: "zh-CN",
  // title: "luxiag's Blog",

  theme,

  shouldPrefetch: false,
  // bundler: webpackBundler({
  //   postcss: {},
  //   vue: {},
  // }),
});
