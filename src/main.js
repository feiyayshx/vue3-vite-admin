import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import '@/styles/normalize.css'

let app= createApp(App)
app.use(router).mount('#app')
