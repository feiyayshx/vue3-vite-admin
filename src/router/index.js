import { createRouter, createWebHistory } from 'vue-router'
import LayoutMain from '../views/layouts/layout-main.vue'
import login from '../views/login/login.vue'
import { useUserStore } from '@/store/index.js'
// 静态路由
const staticLayoutMainRouters = []
// 获取modules下的路由模块
const routerModules = import.meta.glob('@/router/modules/*.js', { eager: true })
console.log(routerModules, 'routerModules')
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
  // path不存在时，导航到默认路由-TODO:改造成动态默认路由
  if (to.path === '/') {
    next('/dashboard')
  }
  console.log(to, 'to')
  addTagsList(to)
  next()
})
export default router
