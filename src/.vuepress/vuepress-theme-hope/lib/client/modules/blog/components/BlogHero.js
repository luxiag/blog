import { usePageFrontmatter, usePageHeadTitle, withBase, } from "@vuepress/client";
import { computed, defineComponent, h, ref } from "vue";
import DropTransition from "@theme-hope/components/transitions/DropTransition.js";
import { SlideDownIcon } from "./icons/icons.js";
import defaultHeroBgImagePath from "../assets/hero.jpg";
import "../styles/blog-hero.scss";
export default defineComponent({
    name: "BlogHero",
    setup(_props, { slots }) {
        const title = usePageHeadTitle();
        const frontmatter = usePageFrontmatter();
        const hero = ref(null);
        const heroImage = computed(() => frontmatter.value.heroImage || null);
        const isFullScreen = computed(() => frontmatter.value.heroFullScreen || false);
        const heroImageStyle = computed(() => {
            const defaultStyle = {
                maxHeight: "180px",
                margin: frontmatter.value.heroText === false
                    ? "6rem auto 1.5rem"
                    : "1rem auto",
            };
            return {
                ...defaultStyle,
                ...frontmatter.value.heroImageStyle,
            };
        });
        const bgImage = computed(() => frontmatter.value.bgImage
            ? withBase(frontmatter.value.bgImage)
            : frontmatter.value.bgImage ?? defaultHeroBgImagePath);
        const bgImageStyle = computed(() => {
            const defaultStyle = {
                height: "350px",
                textAlign: "center",
                overflow: "hidden",
            };
            return {
                ...defaultStyle,
                ...frontmatter.value.bgImageStyle,
            };
        });
        return  null;
    },
});
//# sourceMappingURL=BlogHero.js.map