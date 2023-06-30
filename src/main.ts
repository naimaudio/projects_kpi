import { createApp } from "vue";
import { createPinia } from "pinia";
import "@/assets/global.css";
import App from "@/App.vue";
import router from "@/router";
import { clickOutside } from "@/directives/clickOutside";
import {
    provideFluentDesignSystem,
    fluentButton,
    fluentNumberField,
    fluentTextArea,
    fluentSelect,
    fluentOption,
    fluentTooltip,
    fluentCheckbox,
    fluentTextField,
} from "@fluentui/web-components";

import { extend } from "dayjs";
import isoWeekInYear from "dayjs/plugin/isoWeeksInYear";
import isLeapYear from "dayjs/plugin/isLeapYear";
import weekOfYear from "dayjs/plugin/weekOfYear";

extend(weekOfYear);
extend(isoWeekInYear);
extend(isLeapYear);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.directive("clickOutside", clickOutside);
app.mount("#app");
provideFluentDesignSystem().register(
    fluentTooltip(),
    fluentButton(),
    fluentNumberField(),
    fluentTextArea(),
    fluentSelect(),
    fluentOption(),
    fluentCheckbox(),
    fluentTextField()
);
