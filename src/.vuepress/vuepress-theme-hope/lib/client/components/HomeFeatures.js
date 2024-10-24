import { usePageFrontmatter } from "@vuepress/client";
import { isArray, isLinkExternal } from "@vuepress/shared";
import { computed, defineComponent, h } from "vue";
import { RouterLink } from "vue-router";
import Icon from "@theme-hope/components/Icon.js";
export default defineComponent({
    name: "HomeFeatures",
    setup() {
        const frontmatter = usePageFrontmatter();
        const features = computed(() => {
            if (isArray(frontmatter.value.features))
                return frontmatter.value.features;
            return [];
        });
        return () => features.value.length
            ? h("div", { class: "features" }, frontmatter.value.features?.map((feature) => {
                const children = [
                    h(Icon, { icon: feature.icon }),
                    h("h2", { innerHTML: feature.title }),
                    h("p", { innerHTML: feature.details }),
                ];
                return feature.link
                    ? isLinkExternal(feature.link)
                        ? h("a", {
                            class: "feature link",
                            href: feature.link,
                            role: "navigation",
                            "aria-label": feature.title,
                            target: "_blank",
                        }, children)
                        : h(RouterLink, {
                            class: "feature link",
                            to: feature.link,
                            role: "navigation",
                            "aria-label": feature.title,
                        }, () => children)
                    : h("div", { class: "feature" }, children);
            }))
            : null;
    },
});
//# sourceMappingURL=HomeFeatures.js.map