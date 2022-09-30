import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  dest: "./dist",

  title:'luxiag',

  theme,

  shouldPrefetch: false,
});
