import type { ComputedRef, InjectionKey } from "vue";
import type { BlogTypeData } from "vuepress-plugin-blog2";
import type { ArticleInfo } from "../../../../shared/index.js";
export declare type StarsRef = ComputedRef<BlogTypeData<ArticleInfo>>;
export declare const starsSymbol: InjectionKey<StarsRef>;
/**
 * Inject stars
 */
export declare const useStars: () => StarsRef;
export declare const setupStars: () => void;
