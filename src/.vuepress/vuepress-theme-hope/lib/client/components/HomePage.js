import { defineComponent, h } from "vue";
import { usePageFrontmatter } from "@vuepress/client";
import DropTransition from "@theme-hope/components/transitions/DropTransition.js";
import HomeFeatures from "@theme-hope/components/HomeFeatures.js";
import MarkdownContent from "@theme-hope/components/MarkdownContent.js";
import HomeHero from "@theme-hope/components/HomeHero.js";
import "../styles/home-page.scss";
export default defineComponent({
    name: "HopePage",
    setup(_props, { slots }) {
        const frontmatter = usePageFrontmatter();
        return () => h("main", {
            class: "home project",
            id: "main-content",
            "aria-labelledby": frontmatter.value.heroText === null ? undefined : "main-title",
        }, [
            slots["top"]?.(),
            h(HomeHero),
            h(DropTransition, { appear: true, delay: 0.16 }, () => h(HomeFeatures)),
            slots["center"]?.(),
            h(DropTransition, { appear: true, delay: 0.24 }, () => h(MarkdownContent, { custom: true })),
            slots["bottom"]?.(),
        ]);
    },
});
//# sourceMappingURL=HomePage.js.map