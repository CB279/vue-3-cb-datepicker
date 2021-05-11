<template>
    <picker @prev="prev" @next="next">
        <template #header>
            <slot name="header" :format="headerFormat">{{ headerFormat }}</slot>
        </template>
        <template #body>
            <div :class="['cb--datepicker-body-item cb--datepicker-body-year']">
                <div
                    v-for="(item, i) in years"
                    :key="i"
                    :class="css(item)"
                    @click="select(item)"
                >
                    <slot
                        name="year"
                        :data="item"
                        :isDisable="isDisable"
                        :isMin="isMin"
                        :isMax="isMax"
                    >
                        <div>{{ item.format }}</div>
                    </slot>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="cb--datepicker-footer" v-if="multiple || today">
                <button class="cls" @click="clear" v-if="multiple">
                    {{ textClear }}
                </button>
                <button class="td" @click="gotoday" v-if="today">
                    {{ textToday }}
                </button>
            </div>
        </template>
    </picker>
</template>

<script>
import { computed, provide, reactive, readonly, toRefs } from "vue";
import { options, _year_, __moment__ } from "../lib/core.js";
import picker from "./picker.vue";

export default {
    components: {
        picker
    },
    props: {
        length: {
            type: Number,
            default: 16
        },
        multiple: Boolean,
        modelValue: [Array, Object],
        start: [String, Number, Object],
        min: [String, Number, Object],
        max: [String, Number, Object],
        today: Boolean,
        disable: Function
    },
    setup(props, { attrs, emit }) {
        const state = reactive({
            today: __moment__(),
            years: [],
            headerFormat: computed(
                () =>
                    `${state.years[0].data.$format("YYYY")} - ${state.years[
                        state.years.length - 1
                    ].data.$format("YYYY")}`
            )
        });

        const dataToday = computed(() => state.today.format("YYYY"));

        const update_today = () => {
            state.today = __moment__();
        };

        const active = computed(() => {
            if (!props.modelValue) {
                return [];
            }
            const actives = props.multiple
                ? props.modelValue
                : [props.modelValue];
            return actives
                .map(data => {
                    return {
                        data,
                        year: data.format("YYYY")
                    };
                })
                .filter(ac => ac);
        });

        const years = computed(() => state.years);

        const headerFormat = computed(() => state.headerFormat);

        const dateMin = computed(() => {
            if (props.min) {
                return props.min && props.min.year();
            }
        });

        const dateMax = computed(() => {
            if (props.max) {
                return props.max && props.max.year();
            }
        });

        const css = item => {
            const css = [];
            if (item.year == dataToday.value) {
                css.push("today");
            }
            if (active.value.some(d => d.year == item.year)) {
                css.push("active");
            }
            if (
                (props.disable && disable(item.data)) ||
                item.year < dateMin.value ||
                item.year > dateMax.value
            ) {
                css.push("disable");
            }
            return css;
        };

        const update = (
            focusData = active.value[0] && active.value[0].data
        ) => {
            update_today();
            let year = (
                focusData ||
                props.start ||
                state.today ||
                __moment__()
            ).year();
            year = Math.floor(parseInt(year) / props.length) * props.length;
            if (year < 1) {
                year = 1;
            }
            const ys = [];
            for (let y = year; y < year + props.length; y++) {
                const data = __moment__(y, "YYYY");
                ys.push({
                    data,
                    format: data.$format("YYYY"),
                    year: y
                });
            }
            state.years = ys;
        };
        update();

        const prev = () => {
            update(__moment__(--state.years[0].year, "YYYY"));
        };

        const next = () => {
            update(
                __moment__(++state.years[state.years.length - 1].year, "YYYY")
            );
        };

        const isPrev = computed(() =>
            dateMin.value ? state.years[0].year > dateMin.value : true
        );
        provide("isPrev", isPrev);

        const isNext = computed(() =>
            dateMax.value
                ? state.years[state.years.length - 1].year < dateMax.value
                : true
        );
        provide("isNext", isNext);

        const _disable = item => {
            return props.disable && props.disable(item);
        };

        const _min = item => {
            return item.year < dateMin.value;
        };

        const _max = item => {
            return item.year > dateMax.value;
        };

        const select = item => {
            if (_min(item) || _max(item) || _disable(item)) {
                return;
            }
            if (attrs.onSelect) {
                return emit("select", item.data);
            }
            const actived = active.value.find(d => d.year == item.year);
            if (props.multiple) {
                if (actived) {
                    props.modelValue.splice(active.value.indexOf(actived), 1);
                } else {
                    props.modelValue.push(item.data);
                }
            } else {
                if (actived) {
                    emit("update:modelValue", null);
                    emit("change", null);
                } else {
                    emit("update:modelValue", item.data);
                    emit("change", item.data);
                }
            }
            emit("selected", item.data);
        };

        const clear = () => {
            if (props.multiple) {
                emit("update:modelValue", []);
            } else {
                emit("update:modelValue", null);
            }
        };

        const gotoday = () => {
            update_today();
            update(state.today);
        };

        return {
            years,
            headerFormat,
            css,
            prev,
            next,
            select,
            update,
            clear,
            gotoday,
            textTime: options.time,
            textClear: options.clear,
            textToday: options.today,
            isDisable: _disable,
            isMin: _min,
            isMax: _max
        };
    }
};
</script>
