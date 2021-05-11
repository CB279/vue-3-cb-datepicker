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
        <date-inline
            :ref="picker"
            v-bind="$attrs"
            v-model="modelValue"
            :multiple="multiple"
            :time="time"
            @selected="selected"
        >
            <template #date="ss">
                <slot name="date" :data="ss.data">
                    <div>{{ ss.data.d }}</div>
                </slot>
            </template>
        </date-inline>
    </pop-tip>
</template>

<script>
import { computed } from "vue";
import format from "../use/format";
import popTip from "./poptip.vue";
import dateInline from "./date-inline.vue";

export default {
    components: {
        popTip,
        dateInline
    },
    props: {
        placeholder: String,
        format: String,
        time: Boolean,
        multiple: Boolean,
        modelValue: [Array, Object]
    },
    setup(props) {
        const timeFormat = computed(() => (props.time ? " HH:mm" : ""));

        const dateFormat = computed(() =>
            props.format ? props.format : "DD/MM/YYYY" + timeFormat
        );

        const useFormat = format(props, dateFormat, true);

        return {
            ...useFormat
        };
    }
};
</script>
