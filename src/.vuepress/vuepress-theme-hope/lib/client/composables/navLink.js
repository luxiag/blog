import { useRouter } from "vue-router";
import { resolveRouteWithRedirect } from "vuepress-shared/client";
/**
 * Resolve AutoLink props from string
 *
 * @example
 * - Input: '/README.md'
 * - Output: { text: 'Home', link: '/' }
 */
export const useAutoLink = (item, preferFull = false) => {
    const router = useRouter();
    const { fullPath, meta, name } = resolveRouteWithRedirect(router, encodeURI(item));
    return {
        text: !preferFull && meta["s" /* ArticleInfoType.shortTitle */]
            ? meta["s" /* ArticleInfoType.shortTitle */]
            : meta["t" /* ArticleInfoType.title */] || item,
        link: name === "404" ? item : fullPath,
        ...(meta["i" /* ArticleInfoType.icon */] ? { icon: meta["i" /* ArticleInfoType.icon */] } : {}),
    };
};
//# sourceMappingURL=navLink.js.map