import { Transition, defineComponent, h } from "vue";
import { useScrollPromise } from "@theme-hope/composables/index.js";
import "../../styles/fade-slide-y.scss";
export default defineComponent({
    name: "FadeSlideY",
    setup(_props, { slots }) {
        // handle scrollBehavior with transition
        const scrollPromise = useScrollPromise();
        const onBeforeEnter = scrollPromise.resolve;
        const onBeforeLeave = scrollPromise.pending;
        return () => h(Transition, {
            name: "fade-slide-y",
            mode: "out-in",
            onBeforeEnter,
            onBeforeLeave,
        }, () => slots["default"]?.());
    },
});
//# sourceMappingURL=FadeSlideY.js.map