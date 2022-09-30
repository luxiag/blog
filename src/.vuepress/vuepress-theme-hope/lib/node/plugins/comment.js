import { commentPlugin } from "vuepress-plugin-comment2";
export const getCommentPlugin = (options, legacy = false) => {
    if (options === false || !options?.provider)
        return null;
    return commentPlugin({
        provider: "None",
        ...(options?.provider === "Waline"
            ? { dark: 'html[data-theme="dark"]' }
            : {}),
        ...(options || {}),
    }, legacy);
};
//# sourceMappingURL=comment.js.map