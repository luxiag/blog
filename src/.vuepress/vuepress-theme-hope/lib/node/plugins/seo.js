import { seoPlugin } from "vuepress-plugin-seo2";
import { getBlogOptions } from "./blog.js";
export const getSEOPlugin = (themeConfig, { blog, seo }, hostname = "", legacy = false) => {
    if (seo === false)
        return null;
    // disable seo if `hostname` is not set and no options for seo plugin
    if (!Object.keys(seo || {}).length && !hostname)
        return null;
    const blogOptions = getBlogOptions(blog);
    const isArticle = ({ filePathRelative, frontmatter, pathLocale, path, }) => {
        if (!filePathRelative || frontmatter["home"])
            return false;
        const localePath = path.replace(new RegExp(`^${pathLocale}`), "/");
        return Object.entries(blogOptions)
            .filter((item) => typeof item[1] === "string")
            .every(([, value]) => !localePath.startsWith(value));
    };
    return seoPlugin({
        hostname,
        ...(themeConfig.author ? { author: themeConfig.author } : {}),
        isArticle,
        ...(seo || {}),
    }, legacy);
};
//# sourceMappingURL=seo.js.map