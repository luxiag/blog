import { defineUserConfig } from "@vuepress/cli";
import theme from "./theme.js";
// import { webpackBundler } from "@vuepress/bundler-webpack";
// import { componentsPlugin } from "vuepress-plugin-components";

export default defineUserConfig({
  base: "/",
  dest: "./dist",
  lang: "zh-CN",
  title: "luxiag",

  theme,

  shouldPrefetch: false,
  // bundler: webpackBundler({
  //   postcss: {},
  //   vue: {},
  // }),
});
