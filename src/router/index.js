import { createRouter,createWebHistory } from 'vue-router'
import LayoutMain from '../views/layouts/layout-main.vue'
import login from '../views/login/login.vue'
const routes = [
  {
    path: '/',
    name: 'LayoutMain',
    component: LayoutMain
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/:pachMatch(.*)*',
    redirect: '/',
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router