/* ==================== 没有子级的单页面路由 =================== */
const othersRoute = [
  // 首页/工作台
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue')
  }
]

export default othersRoute
