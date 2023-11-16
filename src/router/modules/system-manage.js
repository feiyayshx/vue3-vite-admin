/*============== 系统管理路由 =============== */
const systemManageRoute = [
  // 角色管理
  {
    path: '/system-manage/role',
    name: 'RoleManage',
    component: () => import('@/views/system-manage/role-manage/role-manage.vue'),
    meta: {
      title: '角色管理'
    }
  },
  // 菜单管理
  {
    path: '/system-manage/menu',
    name: 'MenuManage',
    component: () => import('@/views/system-manage/menu-manage/menu-manage.vue'),
    meta: {
      title: '菜单管理'
    }
  },
  // 用户管理
  {
    path: '/system-manage/user',
    name: 'UserManage',
    component: () => import('@/views/system-manage/user-manage/user-manage.vue'),
    meta: {
      title: '用户管理'
    }
  }
]
export default systemManageRoute
