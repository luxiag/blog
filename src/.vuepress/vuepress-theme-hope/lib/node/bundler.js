import { addViteOptimizeDepsExclude, addViteOptimizeDepsInclude, tagHint, } from "vuepress-shared/node";
/**
 * Add tags as customElement
 *
 * @param config VuePress Bundler config
 * @param app VuePress Node App
 * @param customElements tags recognized as custom element
 */
export const checkTag = (config, app) => {
    const { bundler } = app.options;
    // for vite
    if (bundler.name.endsWith("vite")) {
        const viteBundlerConfig = config;
        if (!viteBundlerConfig.vuePluginOptions)
            viteBundlerConfig.vuePluginOptions = {};
        if (!viteBundlerConfig.vuePluginOptions.template)
            viteBundlerConfig.vuePluginOptions.template = {};
        if (!viteBundlerConfig.vuePluginOptions.template.compilerOptions)
            viteBundlerConfig.vuePluginOptions.template.compilerOptions = {};
        const { isCustomElement } = viteBundlerConfig.vuePluginOptions.template.compilerOptions;
        viteBundlerConfig.vuePluginOptions.template.compilerOptions.isCustomElement =
            (tag) => {
                if (isCustomElement) {
                    const result = isCustomElement(tag);
                    if (!result)
                        tagHint(tag, app.env.isDebug);
                    return result;
                }
                tagHint(tag, app.env.isDebug);
            };
    }
    // for webpack
    if (bundler.name.endsWith("webpack")) {
        const webpackBundlerConfig = config;
        if (!webpackBundlerConfig.vue)
            webpackBundlerConfig.vue = {};
        if (!webpackBundlerConfig.vue.compilerOptions)
            webpackBundlerConfig.vue.compilerOptions = {};
        const { isCustomElement } = webpackBundlerConfig.vue.compilerOptions;
        webpackBundlerConfig.vue.compilerOptions.isCustomElement = (tag) => {
            if (isCustomElement) {
                const result = isCustomElement(tag);
                if (!result)
                    tagHint(tag, app.env.isDebug);
                return result;
            }
            tagHint(tag, app.env.isDebug);
        };
    }
};
export const updateBundlerConfig = (config, app) => {
    addViteOptimizeDepsInclude({ app, config }, "@vueuse/core");
    addViteOptimizeDepsExclude({ app, config }, "@theme-hope");
    checkTag(config, app);
};
//# sourceMappingURL=bundler.js.map