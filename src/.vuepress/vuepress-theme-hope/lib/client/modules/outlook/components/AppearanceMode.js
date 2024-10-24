import { computed, defineComponent, h } from "vue";
import AppearanceSwitch from "@theme-hope/modules/outlook/components/AppearanceSwitch.js";
import { useThemeData, useThemeLocaleData, } from "@theme-hope/composables/index.js";
import "../styles/appearance-switch.scss";
export default defineComponent({
    name: "AppearanceMode",
    setup() {
        const themeData = useThemeData();
        const themeLocale = useThemeLocaleData();
        const locale = computed(() => themeLocale.value.outlookLocales.darkmode);
        const darkmode = computed(() => themeData.value.darkmode);
        const enable = computed(() => darkmode.value === "switch" || darkmode.value === "toggle");
        return () => enable.value
            ? h("div", { class: "appearance-wrapper" }, [
                h("label", { class: "appearance-title", for: "appearance-switch" }, locale.value),
                h(AppearanceSwitch),
            ])
            : null;
    },
});
//# sourceMappingURL=AppearanceMode.js.map