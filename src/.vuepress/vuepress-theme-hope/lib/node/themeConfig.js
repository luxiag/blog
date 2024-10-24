import { getLocales } from "vuepress-shared/node";
import { resolveEncrypt } from "./encrypt.js";
import { themeLocalesData } from "./locales/index.js";
const rootAllowConfig = [
    "blog",
    "encrypt",
    "pure",
    "darkmode",
    "themeColor",
    "fullscreen",
    "mobileBreakPoint",
];
const defaultRootOptions = {
    // features
    blog: {},
    encrypt: {},
    // appearance
    pure: false,
    darkmode: "switch",
    themeColor: false,
    fullscreen: false,
};
const defaultLocaleOptions = {
    // features
    blog: {},
    // layouts
    repoDisplay: true,
    navbarIcon: true,
    navbarAutoHide: "mobile",
    hideSiteNameonMobile: true,
    sidebar: "structure",
    sidebarIcon: true,
    headerDepth: 2,
};
/**
 * Get client-side `themeConfig`
 */
export const getThemeConfig = (app, themeOptions, { enableBlog }) => {
    const themeData = {
        ...defaultRootOptions,
        ...Object.fromEntries(Object.entries(themeOptions).filter(([key]) => rootAllowConfig.includes(key))),
        locales: 
        // assign locale data to `themeConfig`
        getLocales({
            app,
            name: "vuepress-theme-hope",
            default: Object.fromEntries(Object.entries(themeLocalesData).map(([locale, config]) => {
                if (!enableBlog) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    delete config.blogLocales;
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    delete config.paginationLocales;
                }
                return [
                    locale,
                    {
                        // default config
                        ...defaultLocaleOptions,
                        ...config,
                    },
                ];
            })),
            // extract localeConfig
            config: Object.fromEntries([
                ["/", {}],
                ...Object.entries(themeOptions.locales || {}),
            ].map(([localePath, localeConfig]) => [
                localePath,
                {
                    // root config
                    ...Object.fromEntries(Object.entries(themeOptions).filter(([key]) => key !== "locales" && !rootAllowConfig.includes(key))),
                    // locale options
                    ...localeConfig,
                },
            ])),
        }),
    };
    // handle encrypt options
    themeData.encrypt = resolveEncrypt(themeData.encrypt);
    if (app.env.isDebug)
        console.log("Theme config: ", themeData);
    return themeData;
};
//# sourceMappingURL=themeConfig.js.map