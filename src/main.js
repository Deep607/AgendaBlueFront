import './assets/main.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura'
import Button from "primevue/button"
import App from './App.vue'
import { ConfirmationService } from 'primevue';


const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
    },
});
app.use(ConfirmationService);
app.component('Button', Button);
app.mount('#app');
