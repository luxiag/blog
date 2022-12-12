import { defineClientConfig } from "@vuepress/client";
import PDF from "./PDF.vue";

export default defineClientConfig({
  enhance({ app }) {
    app.component("PDF", PDF);
  },
});
