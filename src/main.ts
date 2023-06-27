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
