import { computed, reactive } from "vue";
import { __moment__ } from "../lib/core.js";

export default (props, { emit }) => {
    const twoNumber = munber => `0${munber}`.slice(-2);

    const active = computed(() => {
        const data =
            typeof props.modelValue == "object"
                ? props.modelValue.format("HH:mm")
                : props.modelValue;
        const [HH, mm] = (data || "").split(":");
        return {
            HH: HH ? HH : null,
            mm: mm ? mm : null
        };
    });

    const state = reactive({
        hours: props.hours || [
            "00",
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23"
        ],
        minutes: computed(() => {
            let stepping = props.stepping;
            if (stepping > 60) {
                stepping = 60;
            }
            const mins = [];
            for (let i = 0; i < 60; i += stepping) {
                let mm = i;
                if (mm > 59) {
                    mm = 59;
                }
                mins.push(twoNumber(mm));
            }
            return props.minutes || mins;
        })
    });

    const dataHours = computed(() => {
        return state.hours.map(value => ({
            value,
            text: value
        }));
    });

    const Min = computed(() => {
        if (props.min) {
            return {
                HH: props.min.format("HH"),
                mm: props.min.format("mm"),
                ts: props.min.format("HHmm")
            };
        }
    });

    const Max = computed(() => {
        if (props.max) {
            const max = props.max;
            return (
                max && {
                    HH: max.format("HH"),
                    mm: max.format("mm"),
                    ts: max.format("HHmm")
                }
            );
        }
    });

    const _min = (value, f) => {
        return Min.value && value < Min.value[f];
    };

    const _max = (value, f) => {
        return Max.value && value > Max.value[f];
    };

    const hourSelect = computed(() => active.value.HH);

    const dataMinutes = computed(() => {
        return state.minutes.map(value => ({
            value,
            text: value
        }));
    });

    const minuteSelect = computed(() => active.value.mm);

    const disabled = (value, f) => _min(value, f) || _max(value, f);

    const cssHour = item => {
        const css = [];
        if (hourSelect.value == item.value) {
            css.push("select");
        }
        if (disabled(item.value, "HH")) {
            css.push("disable");
        }
        return css;
    };

    const cssMinute = item => {
        const css = [];
        if (minuteSelect.value == item.value) {
            css.push("select");
        }
        if (disabled(+`${hourSelect.value || "00"}${item.value}`, "ts")) {
            css.push("disable");
        }
        return css;
    };

    const getDataSelect = (datas, value) => {
        if (datas.length) {
            const max = Math.max(...datas);
            if (value > max) {
                return twoNumber(max);
            } else {
                return twoNumber(Math.min(...datas));
            }
        } else {
            return "00";
        }
    };

    const autoSelectHour = value => {
        const datas = state.hours.filter(HH => !disabled(HH, "HH"));
        return getDataSelect(datas, value);
    };
    const autoSelectMinute = (HH, value) => {
        const datas = state.minutes.filter(
            mm => !disabled(+`${HH}${mm}`, "ts")
        );
        return getDataSelect(datas, value);
    };

    const autoSelect = () => {
        if (props.forDate) {
            let h, m;
            let HH = hourSelect.value || "00";
            if (disabled(HH, "HH")) {
                h = true;
                HH = autoSelectHour(HH);
            }
            let mm = minuteSelect.value || "00";
            if (disabled(+`${HH}${mm}`, "ts")) {
                m = true;
                mm = autoSelectMinute(HH, mm);
            }
            if (h || m) {
                const value = `${HH}:${mm}`;
                emit("update:modelValue", value);
            }
        }
    };

    const selectHour = sl => {
        if (props.disabled) return;
        const HH = sl.item.value;
        if (disabled(HH, "HH")) return;
        let mm = minuteSelect.value || "00";
        if (disabled(+`${HH}${mm}`, "ts")) {
            mm = autoSelectMinute(HH, mm);
        }
        const value = `${HH}:${mm}`;
        emit("update:modelValue", value);
        sl.close();
    };

    const selectMinute = sl => {
        if (props.disabled) return;
        const val = +`${hourSelect.value || "00"}${sl.item.value}`;
        if (disabled(val, "ts") || disableMinutes.value) return;
        const value = `${active.value.HH || "00"}:${sl.item.value}`;

        emit("update:modelValue", value);
        sl.close();
    };

    const disableMinutes = computed(() => !hourSelect.value);

    return {
        state,
        dataHours,
        dataMinutes,
        hourSelect,
        minuteSelect,
        cssHour,
        cssMinute,
        selectHour,
        selectMinute,
        disableMinutes,
        autoSelect
    };
};
