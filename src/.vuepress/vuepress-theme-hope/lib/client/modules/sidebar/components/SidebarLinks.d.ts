import type { PropType, VNode } from "vue";
import type { ResolvedSidebarItem } from "../../../../shared/index.js";
import "../styles/sidebar-links.scss";
declare const _default: import("vue").DefineComponent<{
    config: {
        type: PropType<ResolvedSidebarItem[]>;
        required: true;
    };
}, () => VNode | null, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    config: {
        type: PropType<ResolvedSidebarItem[]>;
        required: true;
    };
}>>, {}>;
export default _default;
