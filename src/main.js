import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import '@/styles/normalize.css'
import '@/styles/element/element-reset.scss'
import '@/styles/preflight.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import pinia from '@/store/index'
// import 'three-mesh-bvh'
// import 'three/addons/jsm/utils/BufferGeometryUtils.js'

import '/mock/index.js'
let app = createApp(App)

// 全局注册icon图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router).use(pinia).mount('#app')
