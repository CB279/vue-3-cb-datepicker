<template>
    <div :ref="pop" class="cb-poptip">
        <slot name="input" :toggle="toggle">
            <div
                :class="['cb-poptip-placeholder', 'is-selected-' + isSelected]"
                @click="toggle"
            >
                <div class="cb-poptip-text">
                    <slot name="placeholder" />
                </div>
                <div class="cb-scope-icon">
                    <v-icon-date />
                </div>
            </div>
        </slot>
        <div :ref="tool" class="cb-poptip-ul" v-show="show">
            <slot />
        </div>
    </div>
</template>

<script>
import { watch } from "vue";
import poptip from "../use/poptip";

export default {
    props: {
        isSelected: Boolean,
        placement: String
    },
    setup(props, { emit }) {
        const usePoptip = poptip(props);
        watch(
            () => usePoptip.show.value,
            bool => {
                emit("show", bool);
            }
        );

        return usePoptip;
    }
};
</script>
