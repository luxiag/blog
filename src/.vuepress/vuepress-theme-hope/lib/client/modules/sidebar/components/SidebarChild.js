import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import { renderChildren, renderItem, } from "@theme-hope/modules/sidebar/composables/index.js";
import { isActiveSidebarItem } from "@theme-hope/modules/sidebar/utils/index.js";
import "../styles/sidebar-child.scss";
export default defineComponent({
    name: "SidebarChild",
    props: {
        config: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const route = useRoute();
        return () => [
            renderItem(props.config, {
                class: [
                    "sidebar-link",
                    `sidebar-${props.config.type}`,
                    { active: isActiveSidebarItem(route, props.config, true) },
                ],
                exact: true,
            }),
            renderChildren(props.config.children),
        ];
    },
});
//# sourceMappingURL=SidebarChild.js.map