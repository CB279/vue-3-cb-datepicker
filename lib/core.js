import moment from "moment";
import { reactive, watchEffect } from "vue";

export const options = reactive({
    locale: "en",
    thaiyear: false,
    time: "time",
    today: "today",
    clear: "clear"
});

watchEffect(() => {
    moment.locale(options.locale || "en");
});

export const _year_ = YYYY => {
    return YYYY + (options.thaiyear ? 543 : 0);
};

moment.fn.$format = function(inputString) {
    const YYYY = _year_(this.year());
    inputString = inputString
        .replace(/YYYY/i, YYYY)
        .replace(/YY/i, `${YYYY}`.substr(-2));
    return this.format(inputString);
};

export const __moment__ = moment;

export const checkDate = function(data, format) {
    if (data && typeof data === "object" && data._isValid) {
        return data;
    } else if (moment(data)._isValid) {
        return moment(data, format);
    } else {
        return false;
    }
};
