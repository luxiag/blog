import { blogPlugin } from "vuepress-plugin-blog2";
const defaultOptions = {
    article: "/article/",
    category: "/category/",
    categoryItem: "/category/:name/",
    tag: "/tag/",
    tagItem: "/tag/:name/",
    encrypted: "/encrypted/",
    slide: "/slide/",
    star: "/star/",
    timeline: "/timeline/",
};
const compareDate = (dateA, dateB) => {
    if (!dateA)
        return 1;
    if (!dateB)
        return -1;
    return dateB.getTime() - dateA.getTime();
};
const sorter = (pageA, pageB) => {
    const prevKey = pageA.frontmatter.sticky;
    const nextKey = pageB.frontmatter.sticky;
    if (prevKey && nextKey && prevKey !== nextKey)
        return Number(nextKey) - Number(prevKey);
    if (prevKey && !nextKey)
        return -1;
    if (!prevKey && nextKey)
        return 1;
    return compareDate(pageA.routeMeta["d" /* ArticleInfoType.date */], pageB.routeMeta["d" /* ArticleInfoType.date */]);
};
export const getBlogOptions = (options) => ({
    ...defaultOptions,
    ...(typeof options === "object" ? options : {}),
});
export const getTitleLocales = (themeData, key) => Object.fromEntries(Object.entries(themeData.locales).map(([localePath, value]) => [
    localePath,
    value.blogLocales[key],
]));
export const getBlogPlugin = (themeData, options) => {
    if (!options)
        return null;
    const blogOptions = {
        ...defaultOptions,
        ...(typeof options === "object" ? options : {}),
    };
    return blogPlugin({
        metaScope: "",
        filter: blogOptions.filter ||
            (({ routeMeta }) => routeMeta["y" /* ArticleInfoType.type */] == "a" /* PageType.article */ ||
                routeMeta["y" /* ArticleInfoType.type */] == "s" /* PageType.slide */),
        category: [
            {
                key: "category",
                getter: ({ routeMeta, }) => routeMeta["c" /* ArticleInfoType.category */] || [],
                sorter,
                path: blogOptions.category,
                layout: "Blog",
                frontmatter: (localePath) => ({
                    title: themeData.locales[localePath].blogLocales.category,
                }),
                itemPath: blogOptions.categoryItem,
                itemFrontmatter: (name, localePath) => ({
                    title: `${name} ${themeData.locales[localePath].blogLocales.category}`,
                }),
                itemLayout: "Blog",
            },
            {
                key: "tag",
                getter: ({ routeMeta, }) => routeMeta["g" /* ArticleInfoType.tag */] || [],
                sorter,
                path: blogOptions.tag,
                layout: "Blog",
                frontmatter: (localePath) => ({
                    title: themeData.locales[localePath].blogLocales.tag,
                }),
                itemPath: blogOptions.tagItem,
                itemLayout: "Blog",
                itemFrontmatter: (name, localePath) => ({
                    title: `${name} ${themeData.locales[localePath].blogLocales.tag}`,
                }),
            },
        ],
        type: [
            {
                key: "article",
                sorter,
                filter: ({ frontmatter, }) => frontmatter.article !== false,
                path: blogOptions.article,
                layout: "Blog",
                frontmatter: (localePath) => ({
                    title: themeData.locales[localePath].blogLocales.article,
                }),
            },
            {
                key: "encrypted",
                sorter,
                filter: ({ routeMeta, }) => Boolean(routeMeta["n" /* ArticleInfoType.isEncrypted */]),
                path: blogOptions.encrypted,
                layout: "Blog",
                frontmatter: (localePath) => ({
                    title: themeData.locales[localePath].blogLocales.encrypt,
                }),
            },
            {
                key: "slide",
                sorter,
                filter: ({ routeMeta, }) => routeMeta["y" /* ArticleInfoType.type */] === "s" /* PageType.slide */,
                path: blogOptions.slide,
                layout: "Blog",
                frontmatter: (localePath) => ({
                    title: themeData.locales[localePath].blogLocales.slides,
                }),
            },
            {
                key: "star",
                sorter: (pageA, pageB) => {
                    const prevKey = pageA.frontmatter.star;
                    const nextKey = pageB.frontmatter.star;
                    if (prevKey && nextKey && prevKey !== nextKey)
                        return Number(nextKey) - Number(prevKey);
                    if (prevKey && !nextKey)
                        return -1;
                    if (!prevKey && nextKey)
                        return 1;
                    return compareDate(pageA.routeMeta["d" /* ArticleInfoType.date */], pageB.routeMeta["d" /* ArticleInfoType.date */]);
                },
                filter: ({ frontmatter, }) => Boolean(frontmatter.star),
                path: blogOptions.star,
                layout: "Blog",
                frontmatter: (localePath) => ({
                    title: themeData.locales[localePath].blogLocales.star,
                }),
            },
            {
                key: "timeline",
                sorter: (pageA, pageB) => compareDate(pageA.routeMeta["d" /* ArticleInfoType.date */], pageB.routeMeta["d" /* ArticleInfoType.date */]),
                filter: ({ frontmatter, routeMeta, }) => "d" /* ArticleInfoType.date */ in routeMeta &&
                    frontmatter["timeline"] !== false,
                path: blogOptions.timeline,
                layout: "Blog",
                frontmatter: (localePath) => ({
                    title: themeData.locales[localePath].blogLocales.timeline,
                }),
            },
        ],
    });
};
//# sourceMappingURL=blog.js.map