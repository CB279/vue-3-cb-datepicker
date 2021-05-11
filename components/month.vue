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
        <month-inline
            :ref="picker"
            v-bind="$attrs"
            v-model="modelValue"
            :multiple="multiple"
            @selected="selected"
        >
            <template #month="ss">
                <slot name="month" :data="ss.data">
                    <div>{{ ss.data.MMMM }}</div>
                </slot>
            </template>
        </month-inline>
    </pop-tip>
</template>

<script>
import { computed } from "vue";
import format from "../use/format";
import popTip from "./poptip.vue";
import monthInline from "./month-inline.vue";

export default {
    components: {
        popTip,
        monthInline
    },
    props: {
        placeholder: String,
        format: String,
        multiple: Boolean,
        modelValue: [Array, Object]
    },
    setup(props) {
        const dateFormat = computed(() =>
            props.format ? props.format : "MM/YYYY"
        );

        const useFormat = format(props, dateFormat);

        return {
            ...useFormat
        };
    }
};
</script>
