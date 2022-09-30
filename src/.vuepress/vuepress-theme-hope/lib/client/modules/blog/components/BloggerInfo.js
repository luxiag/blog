import { useSiteLocaleData, withBase } from "@vuepress/client";
import { computed, defineComponent, h } from "vue";
import { getAuthor } from "vuepress-shared/lib/client";
import SocialMedia from "@theme-hope/modules/blog/components/SocialMedia.js";
import {
  useNavigate,
  useThemeLocaleData,
} from "@theme-hope/composables/index.js";
import {
  useArticles,
  useBlogOptions,
  useCategoryMap,
  useTagMap,
  useTimelines,
} from "@theme-hope/modules/blog/composables/index.js";
import "../styles/blogger-info.scss";
export default defineComponent({
  name: "BloggerInfo",
  setup() {
    const blogOptions = useBlogOptions();
    const siteLocale = useSiteLocaleData();
    const themeLocale = useThemeLocaleData();
    const articles = useArticles();
    const categoryMap = useCategoryMap();
    const tagMap = useTagMap();
    const timelines = useTimelines();
    const navigate = useNavigate();
    const bloggerName = computed(
      () =>
        blogOptions.value.name ||
        getAuthor(themeLocale.value.author)[0]?.name ||
        siteLocale.value.title
    );
    const bloggerAvatar = computed(
      () => blogOptions.value.avatar || themeLocale.value.logo
    );
    const locale = computed(() => themeLocale.value.blogLocales);
    const intro = computed(() => blogOptions.value.intro);
    return () =>
      h("div", {
        // class: "blogger-info",
        // vocab: "https://schema.org/",
        // typeof: "Person",
      });
  },
});
//# sourceMappingURL=BloggerInfo.js.map
