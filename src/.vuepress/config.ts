import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
// import { componentsPlugin } from "vuepress-plugin-components";

export default defineUserConfig({
  base: "/",
  dest: "./dist",
  lang: "zh-CN",
  title: "luxiag",

  theme,

  shouldPrefetch: false,

});
