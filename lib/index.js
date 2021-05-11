import { options, __moment__ } from "./core.js";
import iconDateDefault from "../components/icon-date.vue";
import vYearInline from "../components/year-inline.vue";
import vMonthInline from "../components/month-inline.vue";
import vDateInline from "../components/date-inline.vue";
import vTime from "../components/time.vue";
import vYear from "../components/year.vue";
import vMonth from "../components/month.vue";
import vDate from "../components/date.vue";

import "../css/index.css";

const install = (app, defaultOptions = {}) => {
    let icon = iconDateDefault;
    if (typeof defaultOptions === "object") {
        for (const key in defaultOptions) {
            if (key == "icon") {
                icon = defaultOptions[key];
            } else if (key in options) {
                options[key] = defaultOptions[key];
            }
        }
    }
    options.isIcon = true;

    const __datepicker__ = { options, moment: __moment__ };

    app.config.globalProperties.__datepicker__ = __datepicker__;
    app.config.globalProperties.$moment = __moment__;
    app.provide("__datepicker__", __datepicker__);
    app.provide("$moment", __moment__);

    app.component("vIconDate", icon);
    app.component("vYearInline", vYearInline);
    app.component("vMonthInline", vMonthInline);
    app.component("vDateInline", vDateInline);
    app.component("vTime", vTime);
    app.component("vYear", vYear);
    app.component("vMonth", vMonth);
    app.component("vDate", vDate);
};

export default { install };
