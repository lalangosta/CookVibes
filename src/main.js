import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

const app = createApp(App) // Creamos la app y la guardamos en la variable

app.use(VCalendar, {})     // Le decimos a la app que use el plugin

app.mount('#app')          // Montamos la app en el DOM