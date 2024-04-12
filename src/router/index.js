import { createRouter, createWebHistory } from 'vue-router'
import LayoutMain from '../views/layouts/layout-main.vue'
import login from '../views/login/login.vue'
import { useUserStore } from '@/store/index.js'
import Storage from '@/utils/storage.js'
import { TOKEN } from '@/constants/constant-storage.js'

// 静态路由
const staticLayoutMainRouters = []
// 获取modules下的路由模块
const routerModules = import.meta.glob('@/router/modules/*.js', { eager: true })
Object.keys(routerModules).forEach((key) => {
  staticLayoutMainRouters.push(...routerModules[key].default)
})

const routes = [
  {
    path: '/',
    name: 'LayoutMain',
    component: LayoutMain,
    children: staticLayoutMainRouters
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/:pachMatch(.*)*',
    redirect: '/'
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const { addTagsList } = useUserStore()
  const token = Storage.get(TOKEN)
  // path不存在时，导航到默认路由-TODO:改造成动态默认路由
  if (to.path === '/') {
    next({ path: '/login', replace: true })
  } else if (to.path === '/login' && token) {
    next({ path: '/dashboard', replace: true })
  } else if (to.path !== '/login' && !token) {
    next({ path: '/login', replace: true })
  } else {
    next()
    addTagsList(to)
  }
})
export default router
