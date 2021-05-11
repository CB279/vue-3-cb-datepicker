<template>
    <pop-tip
        :ref="poptip"
        :is-selected="!!textSelected"
        @show="onShow"
        placement="bottom-end"
    >
        <template #placeholder>
            <slot name="placeholder" :textSelected="textSelected">
                {{ textSelected || placeholder }}
            </slot>
        </template>
        <year-inline
            :ref="picker"
            v-bind="$attrs"
            v-model="modelValue"
            :multiple="multiple"
            @selected="selected"
        >
            <template #year="ss">
                <slot name="year" :data="ss.data">
                    <div>{{ ss.data.year }}</div>
                </slot>
            </template>
        </year-inline>
    </pop-tip>
</template>

<script>
import { computed, defineAsyncComponent } from "vue";
import format from "../use/format";
// import popTip from "./poptip.vue";
import yearInline from "./year-inline.vue";

export default {
    components: {
        popTip: defineAsyncComponent(() => import("./poptip.vue")),
        yearInline
    },
    props: {
        placeholder: String,
        format: String,
        multiple: Boolean,
        modelValue: [Array, Object]
    },
    setup(props) {
        const dateFormat = computed(() =>
            props.format ? props.format : "YYYY"
        );

        const useFormat = format(props, dateFormat);

        return {
            ...useFormat
        };
    }
};
</script>
