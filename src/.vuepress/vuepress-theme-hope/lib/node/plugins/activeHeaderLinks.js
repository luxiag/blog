import { activeHeaderLinksPlugin } from "@vuepress/plugin-active-header-links";
/**
 * Resolve options for @vuepress/plugin-active-header-links
 */
export const getActiveHeaderLinksPlugin = (activeHeaderLinks) => {
    if (activeHeaderLinks === false)
        return null;
    return activeHeaderLinksPlugin({
        headerLinkSelector: ".sidebar-link, .toc-link",
        headerAnchorSelector: ".header-anchor",
    });
};
//# sourceMappingURL=activeHeaderLinks.js.map