<template>
    <picker :ref="dEl" @prev="prev" @next="next">
        <template #header>
            <custom-select :item="yearSelect" :items="dataYear">
                <template #top>
                    <div
                        class="push-year-prev"
                        slot="top"
                        @click="pushYear(false)"
                    ></div>
                </template>
                <template #li="sl">
                    <div
                        :key="sl.k"
                        :class="cssYear(sl.item)"
                        @click="selectYear(sl)"
                    >
                        {{ sl.item.text }}
                    </div>
                </template>
                <template #bottom>
                    <div
                        class="push-year-next"
                        slot="top"
                        @click="pushYear(true)"
                    ></div>
                </template>
            </custom-select>
        </template>
        <template #body>
            <div
                :class="['cb--datepicker-body-item cb--datepicker-body-month']"
            >
                <div
                    v-for="(item, i) in items"
                    :key="i"
                    :class="css(item)"
                    @click="select(item)"
                >
                    <slot
                        name="month"
                        :data="item"
                        :isDisable="isDisable"
                        :isMin="isMin"
                        :isMax="isMax"
                    >
                        <div>{{ item.MMMM }}</div>
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
import use_year from "../use/year";
import use_month from "../use/month";
import picker from "./picker.vue";
import customSelect from "./select.vue";

export default {
    components: {
        picker,
        customSelect
    },
    props: {
        multiple: Boolean,
        modelValue: [String, Number, Array, Object],
        start: [String, Number, Object],
        min: [String, Number, Object],
        max: [String, Number, Object],
        today: Boolean,
        disable: Function
    },
    setup(props, { attrs, emit }) {
        const active = computed(() => {
            if (!props.modelValue) {
                return [];
            }
            const actives = props.multiple
                ? props.modelValue
                : [props.modelValue];
            return actives
                .map(data => {
                    let month = data.format("MM"),
                        year = data.format("YYYY");
                    return {
                        data,
                        month,
                        year,
                        value: `${year}-${month}`,
                        ts: `${year}${month}`
                    };
                })
                .filter(ac => ac);
        });

        const dateMin = computed(() => {
            if (props.min) {
                return {
                    YYYY: props.min.format("YYYY"),
                    MM: props.min.format("MM"),
                    ts: props.min.format("YYYYMM")
                };
            }
        });

        const dateMax = computed(() => {
            if (props.max) {
                return {
                    YYYY: props.max.format("YYYY"),
                    MM: props.max.format("MM"),
                    ts: props.max.format("YYYYMM")
                };
            }
        });

        const useYear = use_year({ active, dateMin, dateMax });

        const useMonth = use_month({ active, dateMin, dateMax });

        const state = reactive({
            today: __moment__(),
            items: computed(() =>
                useMonth.state.months.map(m => {
                    const value = `${useYear.state.year}-${m.MM}`;
                    return {
                        ...m,
                        data: __moment__(value, "YYYY-MM"),
                        YYYY: useYear.state.year,
                        value,
                        ts: `${useYear.state.year}${m.MM}`
                    };
                })
            ),
            el: null
        });

        const items = computed(() => state.items);

        const dataToday = computed(() => state.today.format("YYYY-MM"));

        const dEl = ref => {
            state.el = ref;
        };

        const update_today = () => {
            state.today = __moment__();
        };

        const isActive = item =>
            active.value.some(ac => ac.value == item.value);

        const css = item => {
            const css = [];
            if (dataToday.value == item.value) {
                css.push("today");
            }
            if (isActive(item)) {
                css.push("active");
            }
            if (
                (props.disable && disable(item)) ||
                (dateMin.value && item.ts < dateMin.value.ts) ||
                (dateMax.value && item.ts > dateMax.value.ts)
            ) {
                css.push("disable");
            }
            return css;
        };

        const update = (focusData = active.value[0]) => {
            update_today();
            if (focusData) {
                useYear.state.year = focusData.year;
            } else {
                const item = props.start || state.today;
                useYear.state.year = item.format("YYYY");
            }
        };
        update();

        const prev = () => {
            useYear.state.year--;
        };

        const next = () => {
            useYear.state.year++;
        };

        const isPrev = computed(
            () => dateMin.value && useYear.state.year > dateMin.value.YYYY
        );
        provide("isPrev", isPrev);

        const isNext = computed(() => () =>
            dateMax.value && useYear.state.year < dateMax.value.YYYY
        );
        provide("isNext", isNext);

        const _disable = item => {
            return props.disable && props.disable(item);
        };

        const _min = item => {
            return dateMin.value && item.ts < dateMin.value.ts;
        };

        const _max = item => {
            return dateMax.value && item.ts > dateMax.value.ts;
        };

        const select = item => {
            const value = item.value;
            if (
                !isActive(item) &&
                (_min(item) || _max(item) || _disable(item))
            ) {
                return;
            }
            if (attrs.onSelect) {
                return emit("select", item.data);
            }
            const actived = active.value.find(ac => ac.value == value);
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
            useYear.state.year = state.today.format("YYYY");
        };

        return {
            yearSelect: useYear.yearSelect,
            dataYear: useYear.dataYear,
            pushYear: useYear.pushYear,
            cssYear: useYear.cssYear,
            selectYear: useYear.selectYear,
            items,
            dEl,
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
