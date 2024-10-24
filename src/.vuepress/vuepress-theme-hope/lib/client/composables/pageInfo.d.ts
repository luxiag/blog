import type { AuthorInfo, DateInfo } from "vuepress-shared";
import type { ComputedRef } from "vue";
import type { PageInfoProps } from "@theme-hope/modules/info/components/PageInfo.js";
import type { PageCategory, PageTag } from "@theme-hope/modules/info/utils/index.js";
import type { PageInfo } from "../../shared/index.js";
export declare const usePageAuthor: () => ComputedRef<AuthorInfo[]>;
export declare const usePageCategory: () => ComputedRef<PageCategory[]>;
export declare const usePageTag: () => ComputedRef<PageTag[]>;
export declare const usePageDate: () => ComputedRef<DateInfo | null>;
export declare const usePageInfo: () => {
    config: PageInfoProps;
    items: ComputedRef<PageInfo[] | false | null>;
};
