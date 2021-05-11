# Other

> <a href="https://github.com/CB279/vue-3-cb-validate">validate</a>

> <a href="https://github.com/CB279/vue-3-cb-alert">alert</a>

> <a href="https://github.com/CB279/vue-3-cb-grid">grid</a>

> <a href="https://github.com/CB279/vue-3-cb-modal">modal</a>

> <a href="https://github.com/CB279/vue-3-cb-select">select</a>

> <a href="https://github.com/CB279/vue-3-cb-sidenav">sidenav</a>

> <a href="https://github.com/CB279/vue-3-cb-paginate">paginate</a>

## Development

npm install @vue-cb/datepicker

## Config

```js
import datepicker from "@vue-cb/datepicker";

createApp(app).use(datepicker, {
    locale: "en",
    today: "today",
    clear: "clear",
    time: "time",
});

//dynamic

const state = reactive({
    lang: "en",
    today: "today",
    clear: "clear",
    time: "time",
});

createApp(app).use(datepicker, {
    locale: computed(() => state.lang),
    today: computed(() => state.today),
    clear: computed(() => state.clear),
    time: computed(() => state.time),
});
```

## Usage

```html
<v-date
    v-model="state.date"
    placeholder="วันที่"
    format="DD MMMM YYYY HH:mm"
    time
    :min="state.minDate"
/>
<v-month v-model="state.month" placeholder="เดือน" format="MMMM YYYY" />
<v-year v-model="state.year" placeholder="ปี" format="YYYY" />
```

inline

```html
<v-date-inline
    v-model="state.date"
    placeholder="วันที่"
    format="DD MMMM YYYY HH:mm"
    time
    :min="state.minDate"
/>
```

custom time

```html
<v-date-inline
    v-model="state.date"
    placeholder="วันที่"
    format="DD MMMM YYYY HH:mm"
    time
    :min="state.minDate"
    :hours="[12, 23]"
    :minutes="[30]"
/>
```

stepping minute

```html
<v-date-inline
    v-model="state.date"
    placeholder="วันที่"
    format="DD MMMM YYYY HH:mm"
    time
    :min="state.minDate"
    :stepping="30"
/>
```

custom slot

```html
<v-date
    v-model="state.date"
    placeholder="วันที่"
    format="DD MMMM YYYY HH:mm"
    time
    :min="state.minDate"
    :stepping="30"
>
    <template #date="ss">
        <div>({{ ss.data.d }})</div>
    </template>
</v-date>
```

```js
import moment from "moment";

const state = reactive({
    date: moment(),
    minDate: moment(),
    month: moment(),
    year: moment(),
});
```

สำหรับ พ.ศ. ใช้ $moment เฉพาะ locale=th + thaiyear=true

```js
//config
createApp(app).use(datepicker, {
    locale: "th",
    thaiyear: true,
});

//use
// import moment from "moment"; //ไม่รองรับ พ.ศ.
import $moment from "$moment"; //รองรับ พ.ศ.

console.log("วันที่ ", $moment().format("DD/MM/YYYY"));
```

## Props

| name               | value    | default | desciption              |
| ------------------ | -------- | ------- | ----------------------- |
| time               | boolean  | false   | date                    |
| multiple           | boolean  | false   | -                       |
| placeholder        | string   | -       | -                       |
| format             | string   | -       | -                       |
| start              | moment   | -       | -                       |
| min                | moment   | -       | -                       |
| max                | moment   | -       | -                       |
| today              | boolean  | -       | -                       |
| disable            | function | -       | -                       |
| hours              | array    | [00-23] | time or (date and time) |
| minutes            | array    | [00-59] | time or (date and time) |
| stepping           | number   | 1       | time or (date and time) |
| placeholderHours   | string   | hours   | time or (date and time) |
| placeholderMinutes | string   | minutes | time or (date and time) |

## Slots

| name  | desciption |
| ----- | ---------- |
| date  | date       |
| month | month      |
| year  | year       |

## 📑 License

[MIT License](./LICENSE)
