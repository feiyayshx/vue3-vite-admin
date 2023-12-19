/* ==================== 没有子级的单页面路由 =================== */
const othersRoute = [
  // 首页/工作台
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/dashboard.vue'),
    meta: {
      title: '工作台'
    }
  }
]

export default othersRoute
