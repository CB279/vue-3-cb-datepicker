<template>
    <picker :ref="dEl" :disabled="disabled" @prev="prev" @next="next">
        <template #header>
            <custom-select :item="monthSelect" :items="dataMonth" class="month">
                <template #li="sl">
                    <div
                        :key="sl.k"
                        :class="cssMonth(yearSelect, sl.item)"
                        @click="selectMonth(yearSelect, sl)"
                    >
                        {{ sl.item.text }}
                    </div>
                </template>
            </custom-select>
            <custom-select :item="yearSelect" :items="dataYear" class="year">
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
                        slot="bottom"
                        @click="pushYear(true)"
                    ></div>
                </template>
            </custom-select>
        </template>
        <template #body>
            <div class="label-days">
                <div v-for="(day, i) in days" :key="i">
                    {{ day.d }}
                </div>
            </div>
            <div class="cb--datepicker-body-item cb--datepicker-body-date">
                <div
                    v-for="(item, i) in items"
                    :key="i"
                    :class="css(item)"
                    @click="select(item)"
                >
                    <slot
                        name="date"
                        :data="item"
                        :isDisable="isDisable"
                        :isMin="isMin"
                        :isMax="isMax"
                    >
                        <div>{{ item.d }}</div>
                    </slot>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="cb--datepicker-footer" v-if="dataTime && dataTime.data">
                <div>{{ textTime }}:</div>
                <v-time
                    :ref="c => (dataTime.el = c)"
                    v-model="dataTime.value"
                    :min="timeMin"
                    :max="timeMax"
                    :hours="hours"
                    :minutes="minutes"
                    :stepping="stepping"
                    :placeholderHours="placeholderHours"
                    :placeholderMinutes="placeholderMinutes"
                    for-date
                />
            </div>
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
import {
    computed,
    nextTick,
    provide,
    reactive,
    readonly,
    toRefs,
    watchEffect
} from "vue";
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
        modelValue: [Array, Object],
        time: Boolean,
        now: Boolean,
        start: [String, Number, Object],
        min: [String, Number, Object],
        max: [String, Number, Object],
        today: Boolean,
        disable: Function,
        disabled: Boolean,
        hours: Array,
        minutes: Array,
        stepping: Number,
        placeholderHours: String,
        placeholderMinutes: String
    },
    setup(props, { emit }) {
        const days = computed(() => {
            const localeData = __moment__.localeData(options.locale);
            return localeData._weekdays.map((day, i) => ({
                day,
                d: localeData._weekdaysMin[i]
            }));
        });

        const get_data_format = (data, today) => {
            if (props.now && today) {
                data = data.set({
                    hours: today.hours(),
                    minutes: today.minutes()
                });
            }
            let date = data.format("DD"),
                month = data.format("MM"),
                year = data.format("YYYY");
            if (props.time) {
                let hours = data.format("HH"),
                    minutes = data.format("mm");
                return {
                    minutes,
                    hours,
                    d: parseInt(date),
                    date,
                    month,
                    year,
                    value: `${year}-${month}-${date}`,
                    ts: `${year}${month}${date}`
                };
            } else {
                return {
                    d: parseInt(date),
                    date,
                    month,
                    year,
                    value: `${year}-${month}-${date}`,
                    ts: `${year}${month}${date}`
                };
            }
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
                        ...get_data_format(data)
                    };
                })
                .filter(ac => ac);
        });

        const dateMin = computed(() => {
            if (props.min) {
                const min = props.min;
                if (min) {
                    const YYYY = min.format("YYYY"),
                        MM = min.format("MM");
                    return {
                        YYYYMM: `${YYYY}${MM}`,
                        YYYY,
                        MM,
                        DD: min.format("DD"),
                        ts: min.format("YYYYMMDD")
                    };
                }
            }
        });

        const dateMax = computed(() => {
            if (props.max) {
                const max = props.max;
                if (max) {
                    const YYYY = max.format("YYYY"),
                        MM = max.format("MM");
                    return {
                        YYYYMM: `${YYYY}${MM}`,
                        YYYY,
                        MM,
                        DD: max.format("DD"),
                        ts: max.format("YYYYMMDD")
                    };
                }
            }
        });

        const useYear = use_year(props, { active, dateMin, dateMax });

        const useMonth = use_month(props, { active, dateMin, dateMax });

        if (active[0]) {
            useYear.state.year = active[0].year;
            useMonth.state.month = active[0].month;
        }

        const state = reactive({
            today: __moment__(),
            items: computed(() => {
                const dates = [];
                let data = __moment__(
                    `${useYear.state.year}-${useMonth.state.month}`,
                    "YYYY-MM"
                ).startOf("week");
                for (let week = 0; week <= 5; week++) {
                    for (let date = 0; date < 7; date++) {
                        dates.push({
                            week,
                            data,
                            ...get_data_format(data, state.today)
                        });
                        data = __moment__(data).add(1, "days");
                    }
                }
                return dates;
            }),
            el: null
        });

        const items = computed(() => state.items);

        const dataToday = computed(() => state.today.format("YYYY-MM-DD"));

        const dataTime = reactive({
            el: null,
            value: null,
            data: null
        });

        const setTime = item => {
            if (props.time) {
                if (item) {
                    dataTime.value = `${item.hours}:${item.minutes}`;
                    dataTime.data = item;
                } else {
                    dataTime.data = null;
                }
            }
        };

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
            if (item.month != useMonth.state.month) {
                css.push("out");
            }

            if (dataToday.value == item.value) {
                css.push("today");
            }
            if (
                (props.disable && disable(item)) ||
                (dateMin.value && item.ts < dateMin.value.ts) ||
                (dateMax.value && item.ts > dateMax.value.ts)
            ) {
                css.push("disable");
            }
            if (isActive(item)) {
                css.push("active");
            }
            return css;
        };

        const update = (focusData = active.value[0]) => {
            update_today();
            if (focusData) {
                useYear.state.year = focusData.year;
                useMonth.state.month = focusData.month;
                setTime(focusData);
            } else {
                const item = props.start || state.today;
                useYear.state.year = item.format("YYYY");
                useMonth.state.month = item.format("MM");
            }
        };
        update();

        const twoNumber = num => `0${num}`.slice(-2);

        const prev = () => {
            let m = parseInt(useMonth.state.month) - 1;
            if (m < 1) {
                m = 12;
                useYear.state.year--;
            }
            useMonth.state.month = twoNumber(m);
        };

        const next = () => {
            let m = parseInt(useMonth.state.month) + 1;
            if (m > 12) {
                m = 1;
                useYear.state.year++;
            }
            useMonth.state.month = twoNumber(m);
        };

        const yyyymm = computed(
            () => `${useYear.state.year}${useMonth.state.month}`
        );

        const isPrev = computed(
            () => dateMin.value && yyyymm.value > dateMin.value.YYYYMM
        );
        provide("isPrev", isPrev);

        const isNext = computed(
            () => dateMax.value && yyyymm.value < dateMax.value.YYYYMM
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

        watchEffect(() => {
            const item = dataTime.data;
            if (item) {
                const [HH, mm] = dataTime.value.split(":");
                const data = active.value.find(
                    d =>
                        d.year == item.year &&
                        d.month == item.month &&
                        d.date == item.date &&
                        !(d.hours == HH && d.minutes == mm)
                );
                if (data) {
                    const newData = __moment__(
                        `${item.data.format("YYYY-MM-DD")} ${HH}:${mm}`,
                        "YYYY-MM-DD HH:mm"
                    );
                    if (props.multiple) {
                        props.modelValue[active.value.indexOf(data)] = newData;
                    } else {
                        emit("update:modelValue", newData);
                        emit("change", newData);
                    }
                }
            }
        });

        const select = item => {
            if (props.disabled) return;
            if (props.time && !props.now && dataTime.data) {
                let [hours, minutes] = dataTime.value.split(":");
                let data = __moment__(
                    `${item.value} ${hours}:${minutes}`,
                    "YYYY-MM-DD HH:mm"
                );
                item = {
                    data,
                    ...get_data_format(data)
                };
            }
            const value = item.value;
            if (
                !isActive(item) &&
                (_min(item) || _max(item) || _disable(item))
            ) {
                return;
            }
            const actived = active.value.find(ac => ac.value == value);
            if (props.multiple) {
                if (actived) {
                    setTime();
                    props.modelValue.splice(active.value.indexOf(actived), 1);
                } else {
                    setTime(item);
                    props.modelValue.push(item.data);
                }
            } else {
                if (actived) {
                    setTime();
                    emit("update:modelValue", null);
                    emit("change", null);
                } else {
                    setTime(item);
                    emit("update:modelValue", item.data);
                    emit("change", item.data);
                }
            }
            emit("selected", item.data);
            nextTick(() => {
                if (props.time && dataTime.el) {
                    dataTime.el.autoSelect();
                }
            });
        };

        const timeMin = computed(() => {
            const item = dataTime.data,
                min = dateMin.value;
            if (
                item &&
                min &&
                item.year == min.YYYY &&
                item.month == min.MM &&
                item.date == min.DD
            ) {
                return props.min;
            } else {
                return null;
            }
        });

        const timeMax = computed(() => {
            const item = dataTime.data,
                max = dateMax.value;
            if (
                item &&
                max &&
                item.year == max.YYYY &&
                item.month == max.MM &&
                item.date == max.DD
            ) {
                return props.max;
            } else {
                return null;
            }
        });

        const clear = () => {
            setTime();
            if (props.multiple) {
                emit("update:modelValue", []);
            } else {
                emit("update:modelValue", null);
            }
        };

        const gotoday = () => {
            update_today();
            useYear.state.year = state.today.format("YYYY");
            useMonth.state.month = state.today.format("MM");
        };

        return {
            days,
            monthSelect: useMonth.monthSelect,
            dataMonth: useMonth.dataMonth,
            cssMonth: useMonth.cssMonth,
            selectMonth: useMonth.selectMonth,
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
            dataTime,
            timeMin,
            timeMax,
            clear,
            gotoday,
            update,
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
