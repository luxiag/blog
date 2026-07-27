declare module 'remark-admonitions' {
  import { Plugin } from 'unified';
  interface AdmonitionOptions {
    icon?: string;
    keywords?: string[];
    tag?: string;
  }
  const plugin: Plugin<[AdmonitionOptions?]>;
  export default plugin;
}
