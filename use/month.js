import { computed, reactive } from "vue";
import { options, _year_, __moment__ } from "../lib/core.js";

export default ({ active, dateMin, dateMax }) => {
    const defaultMonth = parseInt(__moment__().format("MM"));

    const state = reactive({
        month: defaultMonth,
        months: computed(() => {
            const localeData = __moment__.localeData(options.locale);
            return localeData._months.map((MMMM, i) => ({
                MMM: localeData._monthsShort[i],
                MMMM,
                MM: `0${++i}`.slice(-2),
                M: i
            }));
        })
    });

    const monthSelect = computed(() => state.month);

    const dataMonth = computed(() => {
        return state.months.map(({ MM, MMMM }) => ({
            value: MM,
            text: MMMM
        }));
    });

    const disabled = YYYYMM =>
        (dateMin.value && YYYYMM < dateMin.value.YYYYMM) ||
        (dateMax.value && YYYYMM > dateMax.value.YYYYMM);

    const cssMonth = (year, item) => {
        const value = item.value;
        const css = [];
        if (monthSelect.value == value) {
            css.push("select");
        }
        if (active.value.some(ac => ac.year == year && ac.month == value)) {
            css.push("active");
        }
        const YYYYMM = `${year}${value}`;
        if (disabled(YYYYMM)) {
            css.push("disable");
        }
        return css;
    };

    const selectMonth = (year, sl) => {
        // const value = sl.item.value;
        // const YYYYMM = `${year}${value}`;
        // if (disabled(YYYYMM)) return;
        state.month = sl.item.value;
        sl.close();
    };

    return { state, monthSelect, dataMonth, cssMonth, selectMonth };
};
