<template>
    <div class="cb--time">
        <custom-select
            :item="hourSelect"
            :items="dataHours"
            :placeholder="placeholderHours"
            placement="top"
            class="hour"
        >
            <template #li="sl">
                <div
                    :key="sl.k"
                    :class="cssHour(sl.item)"
                    @click="selectHour(sl)"
                >
                    {{ sl.item.text }}
                </div>
            </template>
        </custom-select>
        <div class="cb--time-colon">:</div>
        <custom-select
            :item="minuteSelect"
            :items="dataMinutes"
            :placeholder="placeholderMinutes"
            :disabled="disableMinutes"
            placement="top"
            class="minute"
        >
            <template #li="sl">
                <div
                    :key="sl.k"
                    :class="cssMinute(sl.item)"
                    @click="selectMinute(sl)"
                >
                    {{ sl.item.text }}
                </div>
            </template>
        </custom-select>
    </div>
</template>

<script>
import use_time from "../use/time";
import customSelect from "./select.vue";

export default {
    components: {
        customSelect
    },
    props: {
        modelValue: [String, Number, Array, Object],
        min: Object,
        max: Object,
        hours: Array,
        minutes: Array,
        stepping: {
            type: Number,
            default: 1
        },
        placeholderHours: {
            type: String,
            default: "hours"
        },
        placeholderMinutes: {
            type: String,
            default: "minutes"
        },
        forDate: Boolean
    },
    setup(props, { attrs, emit }) {
        const useTime = use_time(props, { attrs, emit });

        return {
            hourSelect: useTime.hourSelect,
            dataHours: useTime.dataHours,
            minuteSelect: useTime.minuteSelect,
            dataMinutes: useTime.dataMinutes,
            cssHour: useTime.cssHour,
            cssMinute: useTime.cssMinute,
            selectHour: useTime.selectHour,
            selectMinute: useTime.selectMinute,
            disableMinutes: useTime.disableMinutes,
            autoSelect: useTime.autoSelect
        };
    }
};
</script>
