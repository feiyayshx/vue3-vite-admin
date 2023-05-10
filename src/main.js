import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import '@/styles/normalize.css'
import '@/styles/element/element-reset.scss'

let app= createApp(App)
app.use(router).mount('#app')
