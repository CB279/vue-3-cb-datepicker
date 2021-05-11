import { reactive, computed } from "vue";
import { __moment__ } from "../lib/core.js";

export default (props, dateFormat, forTime) => {
    const state = reactive({
        poptip: null,
        picker: null
    });

    const poptip = com => {
        state.poptip = com;
    };

    const selected = () => {
        if (props.multiple) return;
        if (forTime && props.time) return;
        state.poptip.close();
    };

    const textSelected = computed(() => {
        if (props.modelValue) {
            if (props.multiple) {
                if (props.modelValue.length) {
                    return props.modelValue
                        .map(d => __moment__(d).$format(dateFormat.value))
                        .join(", ");
                }
            } else {
                return __moment__(props.modelValue).$format(dateFormat.value);
            }
        }
        return false;
    });

    const picker = el => {
        state.picker = el;
    };

    const onShow = bool => {
        if (bool) {
            state.picker.update();
        }
    };

    return {
        poptip,
        selected,
        textSelected,
        onShow,
        picker
    };
};
