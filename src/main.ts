
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/global.css'
import App from '@/App.vue'
import router from '@/router'

import { provideFluentDesignSystem, fluentCard, fluentButton, fluentNumberField } from '@fluentui/web-components';

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
provideFluentDesignSystem().register(fluentCard(), fluentButton(), fluentNumberField());
