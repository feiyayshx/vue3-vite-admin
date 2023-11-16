/*============== 权限控制路由 =============== */
const authorityControlRoute = [
  // 页面权限
  {
    path: '/authority-control/page-auth',
    name: 'PageAuth',
    component: () => import('@/views/authority-control/page-auth/page-auth.vue'),
    meta: {
      title: '页面权限'
    }
  },
  // 操作权限
  {
    path: '/authority-control/operation-auth',
    name: 'OperationAuth',
    component: () => import('@/views/authority-control/operation-auth/operation-auth.vue'),
    meta: {
      title: '操作权限'
    }
  }
]

export default authorityControlRoute
