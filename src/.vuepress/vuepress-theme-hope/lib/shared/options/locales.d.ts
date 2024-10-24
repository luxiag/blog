import type { LocaleData } from "@vuepress/shared";
import type { Author } from "vuepress-shared";
import type { HopeThemeAppearanceLocaleData } from "./appearance.js";
import type { HopeThemeFeatureLocaleConfig, HopeThemeFeatureLocaleData, HopeThemeFeatureLocaleOptions } from "./feature/index.js";
import type { LocaleData2Option } from "./helpers.js";
import type { HopeThemeLayoutLocaleData, HopeThemeLayoutLocaleConfig, HopeThemeLayoutLocaleOptions } from "./layout/index.js";
export interface HopeThemeLocaleData extends HopeThemeAppearanceLocaleData, HopeThemeFeatureLocaleData, HopeThemeLayoutLocaleData {
    /**
     * Current lang code
     */
    lang: string;
}
export declare type HopeThemeLocaleOptions = LocaleData2Option<HopeThemeAppearanceLocaleData> & LocaleData2Option<HopeThemeFeatureLocaleData> & HopeThemeFeatureLocaleOptions & LocaleData2Option<HopeThemeLayoutLocaleData> & HopeThemeLayoutLocaleOptions & {
    /**
     * Global default author
     *
     * 全局默认作者
     */
    author?: Author;
} & LocaleData;
export declare type HopeThemeLocaleConfig = HopeThemeLocaleData & HopeThemeFeatureLocaleConfig & HopeThemeLayoutLocaleConfig & {
    /**
     * Global default author
     *
     * 全局默认作者
     */
    author?: Author;
} & LocaleData;
