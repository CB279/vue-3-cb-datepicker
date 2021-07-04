import { createPopper } from "@popperjs/core";
import { reactive, computed, watch, nextTick, onBeforeUnmount } from "vue";

export default (props, { select } = {}) => {
    const state = reactive({
        pop: null,
        tool: null,
        popper: null,
        show: false
    });

    const pop = el => {
        state.pop = el;
    };

    const tool = el => {
        state.tool = el;
    };

    const show = computed(() => state.show);

    const noParentPop = el => {
        if (!el) {
            return true;
        }
        if (el.localName == "body") {
            return true;
        }
        if (el === state.pop) {
            return false;
        }
        return noParentPop(el.parentElement);
    };

    const clickOutside = e => {
        if (state.show && noParentPop(e.target)) {
            state.show = false;
        }
    };

    if (typeof window !== "undefined") {
        window.addEventListener("click", clickOutside);
    }

    const toggle = () => {
        if (props.disabled) return;
        state.show = !state.show;
        if (select && state.show) {
            nextTick(() => {
                for (const n of state.tool.children) {
                    if (n.classList.contains("select")) {
                        state.tool.scrollTop =
                            n.offsetTop -
                            (state.tool.clientHeight / 2 - n.clientHeight / 2);
                    }
                }
            });
        }
    };

    watch(
        () => state.show,
        bool => {
            if (bool) {
                nextTick(() => {
                    state.popper.update();
                });
            }
        }
    );

    nextTick(() => {
        if (state.pop && state.tool) {
            state.popper = createPopper(state.pop, state.tool, {
                placement: props.placement || "bottom",
                modifiers: [
                    {
                        name: "flip",
                        options: {
                            fallbackPlacements: ["top", "bottom"]
                        }
                    }
                ]
            });
        }
    });

    onBeforeUnmount(() => {
        state.popper.destroy();
        window.removeEventListener("click", clickOutside);
    });

    const close = () => {
        state.show = false;
    };

    return {
        show,
        pop,
        tool,
        toggle,
        close
    };
};
