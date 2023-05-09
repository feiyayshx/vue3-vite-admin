import { createRouter,createWebHistory } from 'vue-router'
import LayoutMain from '../views/layouts/layout-main.vue'
import login from '../views/login/login.vue'
import Dashboard from '@/views/dashboard/index.vue'
const routes = [
  {
    path: '/',
    name: 'LayoutMain',
    component: LayoutMain,
    children: [
      {
        path: '/index',
        name: 'dashboard',
        component:Dashboard
      },
    ]
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