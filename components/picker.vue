<template>
    <div class="cb--datepicker-picker">
        <div class="cb--datepicker-header">
            <div :class="['cb--datepicker-prev', disabled_prev]" @click="prev">
                <div></div>
            </div>
            <div class="cb--datepicker-header-format">
                <slot name="header" />
            </div>
            <div :class="['cb--datepicker-next', disabled_next]" @click="next">
                <div></div>
            </div>
        </div>
        <div class="cb--datepicker-body">
            <slot name="body" />
        </div>
        <slot name="footer" />
    </div>
</template>

<script>
import { computed, inject } from "vue";

export default {
    setup(props, { emit }) {
        const isPrev = inject("isPrev");
        const isNext = inject("isNext");

        const disabled_prev = computed(() =>
            isPrev.value || isPrev.value === undefined ? "" : "disable"
        );
        const disabled_next = computed(() =>
            isNext.value || isNext.value === undefined ? "" : "disable"
        );

        const prev = () => {
            // if (!disabled_prev.value) {
            emit("prev");
            // }
        };

        const next = () => {
            // if (!disabled_next.value) {
            emit("next");
            // }
        };

        return {
            disabled_prev,
            disabled_next,
            prev,
            next
        };
    }
};
</script>
