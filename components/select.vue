<template>
    <div :ref="pop" :class="['cb--datepicker-select', disabled && 'disabled']">
        <div :class="['label-box', `show-${show}`]" @click="toggle">
            <div :class="['label-text', !textItem && 'placeholder']">
                {{ textItem || placeholder }}
            </div>
        </div>
        <div :ref="tool" :class="['uls']" v-show="show">
            <slot name="top" />
            <template v-for="(item, k) in items">
                <slot name="li" :item="item" :k="k" :close="close" />
            </template>
            <slot name="bottom" />
        </div>
    </div>
</template>

<script>
import { computed } from "vue";
import poptip from "../use/poptip";

export default {
    props: ["item", "items", "placeholder", "disabled", "placement"],
    setup(props) {
        const usePoptip = poptip(props, { select: true });

        const textItem = computed(
            () =>
                (props.items.find(item => item.value == props.item) || {}).text
        );

        return {
            ...usePoptip,
            textItem
        };
    }
};
</script>
