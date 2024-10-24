import { computed, defineComponent, h } from "vue";
import { icons } from "@temp/theme-hope/socialMedia";
import { usePure } from "@theme-hope/composables/index.js";
import { useBlogOptions } from "@theme-hope/modules/blog/composables/index.js";
import "../styles/social-media.scss";
export default defineComponent({
    name: "SocialMedia",
    setup() {
        const blogOptions = useBlogOptions();
        const isPure = usePure();
        const mediaLinks = computed(() => {
            const config = blogOptions.value.medias;
            if (config)
                return Object.entries(config).map(([media, url]) => ({
                    name: media,
                    icon: icons[media],
                    url: url,
                }));
            return [];
        });
        return () => mediaLinks.value.length
            ? h("div", { class: "social-media-wrapper" }, mediaLinks.value.map(({ name, icon, url }) => h("a", {
                class: "social-media",
                href: url,
                rel: "noopener noreferrer",
                target: "_blank",
                "aria-label": name,
                ...(isPure.value ? {} : { "data-balloon-pos": "up" }),
                innerHTML: icon,
            })))
            : null;
    },
});
//# sourceMappingURL=SocialMedia.js.map