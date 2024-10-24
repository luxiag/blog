import { usePageLang } from "@vuepress/client";
import { defineComponent, h } from "vue";
import { CalendarIcon } from "@theme-hope/modules/info/components/icons.js";
import { useMetaLocale } from "@theme-hope/modules/info/composables/index.js";
export default defineComponent({
    name: "DateInfo",
    inheritAttrs: false,
    props: {
        date: {
            type: Object,
            default: null,
        },
        localizedDate: {
            type: String,
            default: "",
        },
        pure: Boolean,
    },
    setup(props) {
        const lang = usePageLang();
        const metaLocale = useMetaLocale();
        return () => props.date
            ? h("span", {
                class: "date-info",
                "aria-label": `${metaLocale.value.date}${props.pure ? "" : "📅"}`,
                ...(props.pure ? {} : { "data-balloon-pos": "down" }),
            }, [
                h(CalendarIcon),
                h("span", props.localizedDate ||
                    props.date.value?.toLocaleDateString(lang.value)),
                h("meta", {
                    property: "datePublished",
                    // ISO Format Date string
                    content: props.date?.value?.toISOString() || "",
                }),
            ])
            : null;
    },
});
//# sourceMappingURL=DateInfo.js.map