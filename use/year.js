import { computed, reactive, watch, watchEffect } from "vue";
import { options, _year_, __moment__ } from "../lib/core.js";

export default ({ active, dateMin, dateMax }) => {
    const defaultYear = parseInt(__moment__().format("YYYY"));

    const state = reactive({
        year: defaultYear,
        min: defaultYear - 49,
        max: defaultYear + 49
    });

    watch(
        () => options,
        () => {
            state.max++;
        },
        {
            deep: true
        }
    );

    watchEffect(() => {
        if (active.value.length) {
            const ac = active.value.map(({ year }) => year);
            const min = Math.min(...ac);
            const max = Math.max(...ac);
            if (min < state.min) {
                state.min = min;
            }
            if (max > state.max) {
                state.max = max;
            }
        }
    });

    const yearSelect = computed(() => state.year);

    const dataYear = computed(() => {
        const years = [];
        for (let y = state.min; y <= state.max; y++) {
            years.push(y);
        }
        years.sort((a, b) => (a > b ? 1 : -1));
        return years.map(value => ({
            value,
            text: _year_(value)
        }));
    });

    const pushYear = bool => {
        if (bool) {
            state.max += 10;
        } else {
            if (state.min + 10 < 1) {
                state.min = 1;
            } else {
                state.min -= 10;
            }
        }
    };

    const disabled = value =>
        (dateMin.value && value < dateMin.value.YYYY) ||
        (dateMax.value && value > dateMax.value.YYYY);

    const cssYear = item => {
        const value = item.value;
        const css = [];
        if (state.year == value) {
            css.push("select");
        }
        if (active.value.some(ac => ac.year == value)) {
            css.push("active");
        }
        if (disabled(value)) {
            css.push("disable");
        }
        return css;
    };

    const selectYear = sl => {
        // const value = sl.item.value;
        // if (disabled(value)) return;
        state.year = sl.item.value;
        sl.close();
    };

    return {
        state,
        yearSelect,
        dataYear,
        pushYear,
        cssYear,
        selectYear
    };
};
