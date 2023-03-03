import { createRouter,createWebHistory } from 'vue-router'
import mainLayout from '../views/layouts/main-layout.vue'
import login from '../views/login/login.vue'
const routes = [
  {
    path: '/',
    name: 'mainLayout',
    component: mainLayout
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