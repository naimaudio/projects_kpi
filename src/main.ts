import { createApp } from "vue";
import { createPinia } from "pinia";
import "@/assets/global.css";
import App from "@/App.vue";
import router from "@/router";
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
    fluentProgressRing,
    fluentSearch,
    fluentTabs,
    fluentTabPanel,
    fluentTab,
} from "@fluentui/web-components";
import type { ComposeOption } from "echarts/core";
import { extend } from "dayjs";
import isoWeekInYear from "dayjs/plugin/isoWeeksInYear";
import isLeapYear from "dayjs/plugin/isLeapYear";
import weekOfYear from "dayjs/plugin/weekOfYear";
import "@vuepic/vue-datepicker/dist/main.css";
import * as echarts from "echarts/core";

import { TitleComponent, GridComponent, LegendComponent, TooltipComponent, ToolboxComponent } from "echarts/components";
import { type BarSeriesOption, BarChart, LineChart } from "echarts/charts";
import { SVGRenderer } from "echarts/renderers";

extend(weekOfYear);
extend(isoWeekInYear);
extend(isLeapYear);

export type ECOption = ComposeOption<BarSeriesOption>;

echarts.use([
    TitleComponent,
    SVGRenderer,
    GridComponent,
    BarChart,
    LegendComponent,
    TooltipComponent,
    ToolboxComponent,
    LineChart,
]);

const app = createApp(App);
// registration of the store
app.use(createPinia());
app.use(router);

app.mount("#app");

// Registration of fluent components. Across the whole application,
// it is possible to use the tags <fluent-tooltip>, <fluent-button> etc...
provideFluentDesignSystem().register(
    fluentTabs(),
    fluentTooltip(),
    fluentButton(),
    fluentNumberField(),
    fluentTextArea(),
    fluentSelect(),
    fluentOption(),
    fluentCheckbox(),
    fluentTextField(),
    fluentProgressRing(),
    fluentSearch(),
    fluentTab(),
    fluentTabPanel()
);
