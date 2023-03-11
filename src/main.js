import { createApp } from 'vue'
import '@/styles/normalize.css'
import App from './App.vue'
import router from './router/index.js'

let app= createApp(App)
app.use(router).mount('#app')
